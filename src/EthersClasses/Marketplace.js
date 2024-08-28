import { ethers } from "ethers";
import { ABI } from "../EthersClasses/MarketplaceABI";
import { _MarketplaceContractAddress } from "../EthersClasses/ContractAddress"
const MarketplaceContractAddress = _MarketplaceContractAddress;

export class MarketplaceClass {
    static MINIMUM_BID_INCREMENT = ethers.parseEther("0.1");
    static AUCTION_EXTENSION_TIME = 5 * 60; // 5 minutes in seconds

    constructor(nftContractAddress) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = null;
        this.contract = null;
        this.nftContractAddress = nftContractAddress;
    }

    async setSigner() {
        try {
            this.signer = await this.provider.getSigner();
        } catch (error) {
            console.error("Failed to set signer:", error);
            throw error;
        }
    }

    async getSignerAddress() {
        try {
            if (!this.signer) {
                await this.setSigner();
            }
            return await this.signer.getAddress();
        } catch (error) {
            console.error("Failed to get signer address:", error);
            throw error;
        }
    }

    async initializeContract() {
        try {
            if (!this.signer) {
                await this.setSigner();
            }
            if (!this.contract) {
                this.contract = new ethers.Contract(
                    MarketplaceContractAddress,
                    ABI,
                    this.signer
                );
            }
        } catch (error) {
            console.error("Failed to initialize contract:", error);
            throw error;
        }
    }

    async getNftContractAddress() {
        await this.initializeContract();
        return await this.contract.nft();
    }

    async createAuction(tokenId, startingPrice, duration) {
        try {
            await this.initializeContract();
            const tx = await this.contract.createAuction(tokenId, startingPrice, duration);
            await tx.wait();
            console.log(`Auction created for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            if (error.message.includes("ApprovalNotGivenToMarketplace")) {
                console.error("Approval not given to marketplace. Please approve the marketplace to manage your NFTs.");
            } else {
                console.error("Creating auction failed:", error);
            }
            throw error;
        }
    }

    async placeBid(tokenId, price) {
        try {
            debugger;
            await this.initializeContract();
            const tx = await this.contract.placeBid(tokenId, { value: price });
            await tx.wait();
            console.log(`Bid placed for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Placing bid failed:", error);
            throw error;
        }
    }

    async endAuction(tokenId) {
        try {
            debugger;
            await this.initializeContract();
            const tx = await this.contract.endAuction(tokenId);
            await tx.wait();
            console.log(`Auction ended for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Ending auction failed:", error);
            throw error;
        }
    }

    async createDirectSale(tokenId, price) {
        try {
            debugger;
            await this.initializeContract();
            const tx = await this.contract.createDirectSale(tokenId, price);
            await tx.wait();
            console.log(`Direct sale created for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            if (error.message.includes("ApprovalNotGivenToMarketplace")) {
                console.error("Approval not given to marketplace. Please approve the marketplace to manage your NFTs.");
            } else {
                console.error("Creating direct sale failed:", error);
            }
            throw error;
        }
    }

    async createRentSale(tokenId, price, duration) {
        try {
            await this.initializeContract();
            const tx = await this.contract.createRentSale(tokenId, price, duration);
            await tx.wait();
            console.log(`Rent sale created for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            if (error.message.includes("ApprovalNotGivenToMarketplace")) {
                console.error("Approval not given to marketplace. Please approve the marketplace to manage your NFTs.");
            } else {
                console.error("Creating rent sale failed:", error);
            }
            throw error;
        }
    }

    async buyDirectSale(tokenId, price) {
        try {
            debugger;
            // console.log(ethers.parseEther(price));
            await this.initializeContract();

            // Check if the sale is active
            const sale = await this.contract.directSales(tokenId);
            if (!sale.active) {
                throw new Error("This sale is not active");
            }
            const tx = await this.contract.buyDirectSale(tokenId, {
                value: price // Adjust the value according to your mintPrice in the contract
            });

            await tx.wait();
            console.log(`Direct sale purchased for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Buying direct sale failed:", error);
            throw error;
        }
    }

    async rentNFT(tokenId, price) {
        try {
            await this.initializeContract();
            const tx = await this.contract.rentNFT(tokenId, { value: price });
            await tx.wait();
            console.log(`NFT rented for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Renting NFT failed:", error);
            throw error;
        }
    }

    async cancelDirectSale(tokenId) {
        try {
            await this.initializeContract();
            const tx = await this.contract.cancelDirectSale(tokenId);
            await tx.wait();
            console.log(`Direct sale canceled for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Canceling direct sale failed:", error);
            throw error;
        }
    }

    async cancelRentSale(tokenId) {
        try {
            await this.initializeContract();
            const tx = await this.contract.cancelRentSale(tokenId);
            await tx.wait();
            console.log(`Rent sale canceled for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Canceling rent sale failed:", error);
            throw error;
        }
    }

    async withdraw() {
        try {
            debugger;
            await this.initializeContract();
            const tx = await this.contract.withdraw();
            await tx.wait();
            console.log(`Withdrawal successful. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Withdrawal failed:", error);
            throw error;
        }
    }

    async setNftContract(nftContractAddress) {
        try {
            await this.initializeContract();
            const tx = await this.contract.setNftContract(nftContractAddress);
            await tx.wait();
            console.log(`NFT contract set to ${nftContractAddress}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Setting NFT contract failed:", error);
            throw error;
        }
    }

    async setPlatformFee(fee) {
        try {
            await this.initializeContract();
            const tx = await this.contract.setPlatformFee(fee);
            await tx.wait();
            console.log(`Platform fee set to ${fee}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Setting platform fee failed:", error);
            throw error;
        }
    }

    async pause() {
        try {
            await this.initializeContract();
            const tx = await this.contract.pause();
            await tx.wait();
            console.log(`Contract paused. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Pausing contract failed:", error);
            throw error;
        }
    }

    async unpause() {
        try {
            await this.initializeContract();
            const tx = await this.contract.unpause();
            await tx.wait();
            console.log(`Contract unpaused. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Unpausing contract failed:", error);
            throw error;
        }
    }

    async getPendingReturns(address) {
        try {
            await this.initializeContract();
            const pendingReturns = await this.contract.pendingReturns(address);
            return ethers.formatEther(pendingReturns);
        } catch (error) {
            console.error("Getting pending returns failed:", error);
            throw error;
        }
    }

    async getPlatformFee() {
        try {
            await this.initializeContract();
            const fee = await this.contract.platformFee();
            return fee.toNumber();
        } catch (error) {
            console.error("Getting platform fee failed:", error);
            throw error;
        }
    }

    async isInAuction(tokenId) {
        try {
            await this.initializeContract();
            const auction = await this.contract.auctions(tokenId);
            return auction.endTime > 0 && !auction.ended;
        } catch (error) {
            console.error("Checking auction status failed:", error);
            throw error;
        }
    }

    async isListedForDirectSale(tokenId) {
        try {
            await this.initializeContract();
            const sale = await this.contract.directSales(tokenId);
            return sale.active;
        } catch (error) {
            console.error("Checking direct sale status failed:", error);
            throw error;
        }
    }

    async isListedForRent(tokenId) {
        try {
            await this.initializeContract();
            const rental = await this.contract.rentSales(tokenId);
            return rental.active;
        } catch (error) {
            console.error("Checking rent sale status failed:", error);
            throw error;
        }
    }
}