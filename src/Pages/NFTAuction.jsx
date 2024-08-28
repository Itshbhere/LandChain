import React, { useState } from "react";
import { Card, Button, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { MarketplaceClass } from "../EthersClasses/Marketplace";

const AuctionNFTCard = () => {
  const Contractor = new MarketplaceClass();
  const location = useLocation();
  const navigate = useNavigate();
  const { nft, saleType } = location.state;

  const [bidAmount, setBidAmount] = useState("");

  const handleBid = () => {
    debugger;
    if (!bidAmount || isNaN(parseFloat(bidAmount))) {
      console.error("Invalid bid amount");
      return;
    }
    console.log(`Bidding on NFT with token ID: ${nft.tokenId}`);
    console.log(`Bid amount: ${bidAmount} ETH`);
    // Convert bidAmount to Wei before passing to the contract
    const bidAmountWei = ethers.parseEther(bidAmount);
    // Implement bidding logic here
    Contractor.placeBid(nft.tokenId, bidAmountWei);
  };

  const handleWithdraw = () => {
    console.log(`Withdrawing bid for NFT with token ID: ${nft.tokenId}`);
    // Implement withdraw logic here
    Contractor.withdraw();
  };

  const handleEndAuction = () => {
    console.log(`Ending auction for NFT with token ID: ${nft.tokenId}`);
    // Implement end auction logic here
    Contractor.endAuction(nft.tokenId);
  };

  const formatPrice = (price) => {
    if (!price) return "No current bid";
    try {
      return `${ethers.formatEther(price)} ETH`;
    } catch (error) {
      console.error("Error formatting price:", error);
      return "Invalid price";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="max-w-sm">
        <img
          src={nft.image}
          alt={`Token #${nft.tokenId}`}
          className="w-full h-auto"
        />
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Token #{nft.tokenId}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Current Bid: {formatPrice(nft.price)}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Sale Type: {saleType}
        </p>
        <div className="flex flex-col space-y-2">
          <TextInput
            type="number"
            placeholder="Enter bid amount in ETH"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <Button onClick={handleBid}>Place Bid</Button>
          <Button onClick={handleWithdraw} color="light">
            Withdraw Bid
          </Button>
          <Button onClick={handleEndAuction} color="dark">
            End Auction
          </Button>
        </div>
        <Button color="light" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Card>
    </div>
  );
};

export default AuctionNFTCard;
