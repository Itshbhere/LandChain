import React from "react";
import { Card, Button } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { MarketplaceClass } from "../EthersClasses/Marketplace";

const NFTCard = () => {
  const Contractor = new MarketplaceClass();
  const location = useLocation();
  const navigate = useNavigate();
  const { nft, saleType } = location.state;

  const handleAction = () => {
    console.log(`Action for NFT with token ID: ${nft.tokenId}`);
    if (saleType === "direct") {
      console.log("Buying NFT directly");
      Contractor.buyDirectSale(nft.tokenId, nft.price);
    } else if (saleType === "rent") {
      console.log("Renting NFT");
      Contractor.rentNFT(nft.tokenId, nft.price);
    }
  };

  const getActionButtonText = () => {
    if (saleType === "direct") return "Buy Now";
    if (saleType === "rent") return "Rent";
    return "Take Action";
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
          Price: {ethers.formatEther(nft.price)} ETH
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Sale Type: {saleType}
        </p>
        <Button onClick={handleAction}>{getActionButtonText()}</Button>
        <Button color="light" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Card>
    </div>
  );
};

export default NFTCard;
