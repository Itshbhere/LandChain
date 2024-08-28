// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC4907.sol";

contract LandChain is IERC4907, Ownable, ERC721, ERC721URIStorage {
    struct UserInfo {
        address user; // Address of user role
        uint64 expires; // Unix timestamp, user expires
    }

    mapping(uint256 => UserInfo) internal _users;

    uint256 public mintPrice = 0.05 ether;
    uint256 public maxSupply;
    uint256 public totalSupply = 0;
    mapping(address => uint256) public userAccounts;

    constructor() ERC721("LandChain", "LCT") Ownable(msg.sender) {
        maxSupply = 100;
    }

    /**
     * @dev Allows the owner to set the maximum supply of NFTs.
     * @param maxSupply_ The new maximum supply of NFTs.
     */
    function setMaxSupply(uint256 maxSupply_) external onlyOwner {
        maxSupply = maxSupply_;
    }

    /**
     * @dev Allows users to mint a new NFT if conditions are met.
     *      Users can mint if they haven't reached their mint limit,
     *      total supply hasn't exceeded max supply, and they send enough ether.
     * @param MtokenURI The metadata URI for the new NFT.
     */
    function mint(string calldata MtokenURI) external payable {
        require(userAccounts[msg.sender] < 10, "Buy Premium to Mint More!!");
        require(totalSupply < maxSupply, "Minting Finished");
        require(msg.value >= mintPrice, "Not enough ether sent");
        require(msg.sender != address(0), "Address can't be zero");

        totalSupply++;
        userAccounts[msg.sender]++;
        uint256 tokenId = totalSupply;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, MtokenURI);
    }

    /**
     * @dev Sets the user (tenant) of a specific NFT and specifies the expiry time.
     *      Only the owner or approved user can set the user.
     * @param tokenId The ID of the NFT.
     * @param user The address of the user (tenant).
     * @param expires The Unix timestamp when the user's rights expire.
     */
    function setUser(uint256 tokenId, address user, uint64 expires) external {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "Caller is not owner nor approved"
        );

        _users[tokenId].user = user;
        _users[tokenId].expires = expires;
        emit UpdateUser(tokenId, user, expires);
    }

    /**
     * @dev Returns the current user (tenant) of the specified NFT.
     *      Returns the zero address if the user rights have expired.
     * @param tokenId The ID of the NFT.
     * @return The address of the current user (tenant).
     */
    function userOf(uint256 tokenId) external view override returns (address) {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        } else {
            return address(0);
        }
    }

    /**
     * @dev Returns the Unix timestamp when the user (tenant) rights expire.
     * @param tokenId The ID of the NFT.
     * @return The expiration timestamp.
     */
    function userExpires(
        uint256 tokenId
    ) external view override returns (uint256) {
        return _users[tokenId].expires;
    }

    /**
     * @dev Returns the metadata URI of the specified NFT.
     * @param tokenId The ID of the NFT.
     * @return The metadata URI string.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Checks whether the contract supports a specific interface.
     * @param interfaceId The ID of the interface to check.
     * @return True if the interface is supported, otherwise false.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Internal function to check if a given address is the owner or approved for a specific NFT.
     * @param spender The address to check.
     * @param tokenId The ID of the NFT.
     * @return True if the address is the owner or approved, otherwise false.
     */
    function _isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
    }
}
