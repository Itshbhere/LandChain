// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./LandChain.sol";

contract Marketplace is ReentrancyGuard, Ownable, Pausable {
    using SafeMath for uint256;

    LandChain public nft;

    constructor(LandChain _nft) Ownable(msg.sender) {
        nft = _nft;
    }

    struct Auction {
        address seller;
        uint256 startingPrice;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }

    struct DirectSale {
        address seller;
        uint256 price;
        bool active;
    }

    struct RentSale {
        address seller;
        uint256 price;
        uint64 duration;
        bool active;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => DirectSale) public directSales;
    mapping(address => uint256) public pendingReturns;
    mapping(uint256 => RentSale) public rentSales;

    uint256 public constant MINIMUM_BID_INCREMENT = 0.1 ether;
    uint256 public constant AUCTION_EXTENSION_TIME = 5 minutes;
    uint256 public platformFee = 25; // 2.5% fee

    error ApprovalNotGivenToMarketplace();

    event AuctionCreated(
        uint256 indexed tokenId,
        uint256 startingPrice,
        uint256 endTime
    );
    event BidPlaced(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 amount
    );
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 amount);
    event DirectSaleListed(uint256 indexed tokenId, uint256 price);
    event DirectSalePurchased(
        uint256 indexed tokenId,
        address buyer,
        uint256 amount
    );
    event DirectSaleCanceled(uint256 indexed tokenId);
    event RentSaleListed(
        uint256 indexed tokenId,
        uint256 price,
        uint64 duration
    );
    event RentSalePurchased(
        uint256 indexed tokenId,
        address renter,
        uint256 amount,
        uint64 expirationTime
    );
    event RentSaleCanceled(uint256 indexed tokenId);
    event WithdrawalSuccessful(address indexed bidder, uint256 amount);

    /**
     * @dev Creates a new auction for an NFT.
     *      The auction is only valid if the caller is the owner of the NFT,
     *      the NFT is not currently listed for direct sale or rent, and the caller has approved the marketplace contract.
     * @param tokenId The ID of the NFT to be auctioned.
     * @param startingPrice The minimum starting bid for the auction.
     * @param duration The duration of the auction in seconds.
     */
    function createAuction(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    ) external whenNotPaused {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(auctions[tokenId].endTime == 0, "Auction already exists");
        require(
            directSales[tokenId].active == false,
            "Item is listed for direct sale"
        );
        require(rentSales[tokenId].active == false, "Item is listed for rent");

        if (!nft.isApprovedForAll(msg.sender, address(this))) {
            revert ApprovalNotGivenToMarketplace();
        }

        uint256 endTime = block.timestamp.add(duration);
        auctions[tokenId] = Auction(
            msg.sender,
            startingPrice,
            endTime,
            address(0),
            0,
            false
        );

        emit AuctionCreated(tokenId, startingPrice, endTime);
    }

    /**
     * @dev Places a bid on an active auction.
     *      The bid must be higher than the current highest bid by at least the minimum increment.
     *      If the auction is near its end, the auction duration is extended.
     * @param tokenId The ID of the NFT being auctioned.
     */
    function placeBid(
        uint256 tokenId
    ) external payable nonReentrant whenNotPaused {
        Auction storage auction = auctions[tokenId];
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value >= auction.startingPrice, "Bid below starting price");
        require(
            msg.value >= auction.highestBid.add(MINIMUM_BID_INCREMENT),
            "Bid too low"
        );

        if (auction.highestBidder != address(0)) {
            pendingReturns[auction.highestBidder] = pendingReturns[
                auction.highestBidder
            ].add(auction.highestBid);
        }

        if (block.timestamp > auction.endTime.sub(AUCTION_EXTENSION_TIME)) {
            auction.endTime = block.timestamp.add(AUCTION_EXTENSION_TIME);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    /**
     * @dev Ends an auction and transfers the NFT to the highest bidder.
     *      The seller receives the bid amount minus a platform fee.
     * @param tokenId The ID of the NFT being auctioned.
     */
    function endAuction(uint256 tokenId) external nonReentrant whenNotPaused {
        Auction storage auction = auctions[tokenId];
        require(block.timestamp >= auction.endTime, "Auction not yet ended");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;
        auction.endTime = 0;
        if (auction.highestBidder != address(0)) {
            uint256 fee = auction.highestBid.mul(platformFee).div(1000);
            uint256 sellerProceeds = auction.highestBid.sub(fee);

            nft.transferFrom(auction.seller, auction.highestBidder, tokenId);
            payable(auction.seller).transfer(sellerProceeds);
            payable(owner()).transfer(fee);
        }

        emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
    }

    /**
     * @dev Lists an NFT for direct sale at a fixed price.
     *      The NFT must not be part of an auction or another direct sale or rent.
     * @param tokenId The ID of the NFT to be sold.
     * @param price The fixed price for the sale.
     */
    function createDirectSale(
        uint256 tokenId,
        uint256 price
    ) external whenNotPaused {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            auctions[tokenId].ended == true ||
                auctions[tokenId].seller == address(0),
            "Item is in auction"
        );
        require(!directSales[tokenId].active, "Item already listed for sale");
        require(!rentSales[tokenId].active, "Item is listed for rent");

        if (!nft.isApprovedForAll(msg.sender, address(this))) {
            revert ApprovalNotGivenToMarketplace();
        }
        directSales[tokenId] = DirectSale(msg.sender, price, true);
        emit DirectSaleListed(tokenId, price);
    }

    /**
     * @dev Lists an NFT for rent at a fixed price and for a specific duration.
     *      The NFT must not be part of an auction or another direct sale or rent.
     * @param tokenId The ID of the NFT to be rented.
     * @param price The rental price.
     * @param duration The rental duration in seconds.
     */
    function createRentSale(
        uint256 tokenId,
        uint256 price,
        uint64 duration
    ) external whenNotPaused {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            auctions[tokenId].ended == true ||
                auctions[tokenId].seller == address(0),
            "Item is in auction"
        );
        require(!directSales[tokenId].active, "Item is listed for sale");
        require(!rentSales[tokenId].active, "Item already listed for rent");

        if (!nft.isApprovedForAll(msg.sender, address(this))) {
            revert ApprovalNotGivenToMarketplace();
        }
        uint64 FinalDuration = uint64(block.timestamp) + duration;
        rentSales[tokenId] = RentSale(msg.sender, price, FinalDuration, true);

        emit RentSaleListed(tokenId, price, duration);
    }

    /**
     * @dev Purchases an NFT that is listed for direct sale.
     *      The buyer sends the fixed price, and the seller receives the amount minus a platform fee.
     * @param tokenId The ID of the NFT being purchased.
     */
    function buyDirectSale(
        uint256 tokenId
    ) external payable nonReentrant whenNotPaused {
        DirectSale storage sale = directSales[tokenId];
        require(sale.active, "Item not for sale");
        require(msg.value >= sale.price, "Insufficient payment");

        uint256 fee = msg.value.mul(platformFee).div(1000);
        uint256 sellerProceeds = msg.value.sub(fee);

        sale.active = false;
        nft.transferFrom(sale.seller, msg.sender, tokenId);
        payable(sale.seller).transfer(sellerProceeds);
        payable(owner()).transfer(fee);

        emit DirectSalePurchased(tokenId, msg.sender, msg.value);
    }

    /**
     * @dev Rents an NFT that is listed for rent.
     *      The renter sends the rental price, and the seller receives the amount minus a platform fee.
     *      The renter is granted user rights for the NFT for the specified duration.
     * @param tokenId The ID of the NFT being rented.
     */
    function rentNFT(
        uint256 tokenId
    ) external payable nonReentrant whenNotPaused {
        RentSale storage sale = rentSales[tokenId];
        require(sale.active, "Item not for rent");
        require(msg.value >= sale.price, "Insufficient payment");

        uint256 fee = msg.value.mul(platformFee).div(1000);
        uint256 sellerProceeds = msg.value.sub(fee);

        sale.active = false;
        uint64 expirationTime = uint64(sale.duration);
        nft.setUser(tokenId, msg.sender, expirationTime);
        payable(sale.seller).transfer(sellerProceeds);
        payable(owner()).transfer(fee);

        emit RentSalePurchased(tokenId, msg.sender, msg.value, expirationTime);
    }

    /**
     * @dev Cancels a direct sale listing.
     *      Only the seller can cancel the sale.
     * @param tokenId The ID of the NFT whose sale is being canceled.
     */
    function cancelDirectSale(
        uint256 tokenId
    ) external nonReentrant whenNotPaused {
        DirectSale storage sale = directSales[tokenId];
        require(sale.seller == msg.sender, "Not the seller");
        require(sale.active, "Sale not active");

        sale.active = false;

        emit DirectSaleCanceled(tokenId);
    }

    /**
     * @dev Cancels a rent listing.
     *      Only the seller can cancel the rent.
     * @param tokenId The ID of the NFT whose rent is being canceled.
     */
    function cancelRentSale(
        uint256 tokenId
    ) external nonReentrant whenNotPaused {
        RentSale storage sale = rentSales[tokenId];
        require(sale.seller == msg.sender, "Not the seller");
        require(sale.active, "Rent sale not active");

        sale.active = false;

        emit RentSaleCanceled(tokenId);
    }

    /**
     * @dev Withdraws any pending returns from outbid auctions.
     *      The caller receives the amount they previously bid but lost.
     */
    function withdraw() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw");

        pendingReturns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit WithdrawalSuccessful(msg.sender, amount);
    }

    /**
     * @dev Sets the NFT contract that the marketplace interacts with.
     *      This can only be done by the contract owner.
     * @param _nft The address of the new NFT contract.
     */
    function setNftContract(LandChain _nft) external onlyOwner {
        nft = _nft;
    }

    /**
     * @dev Sets the platform fee percentage.
     *      This can only be done by the contract owner.
     *      The fee cannot exceed 10%.
     * @param fee The new platform fee, represented as a percentage in basis points (e.g., 25 for 2.5%).
     */
    function setPlatformFee(uint256 fee) external onlyOwner {
        require(fee <= 100, "Fee too high"); // Max fee is 10%
        platformFee = fee;
    }

    /**
     * @dev Pauses the contract, preventing any further state-changing functions from being executed.
     *      This can only be done by the contract owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract, allowing state-changing functions to be executed again.
     *      This can only be done by the contract owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Fallback function to reject any direct payments sent to the contract.
     */
    receive() external payable {
        revert("Direct payments not accepted");
    }

    /**
     * @dev Withdraws the platform fees accumulated in the contract.
     *      This can only be done by the contract owner.
     */
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(owner()).transfer(balance);
    }
}
