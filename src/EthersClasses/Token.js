import { ethers } from "ethers";
import { ABI } from "../EthersClasses/EtherTokenabi";

// Replace with your deployed contract address
const TokenContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export class TokenClass {
    constructor() {
        this.provider = new ethers.BrowserProvider(window.ethereum); // Initialize provider
        this.signer = null; // Signer will be set when needed
        this.contract = null; // Contract will be initialized with signer
    }

    async setSigner() {
        try {
            this.signer = await this.provider.getSigner(); // Set signer by connecting to the wallet
        } catch (error) {
            console.error("Failed to set signer:", error);
            throw error; // Propagate error
        }
    }

    async getSignerAddress() {
        try {
            if (!this.signer) {
                await this.setSigner(); // Ensure signer is set
            }
            return await this.signer.getAddress(); // Get the signer's address
        } catch (error) {
            console.error("Failed to get signer address:", error);
            throw error; // Propagate error
        }
    }

    async initializeContract() {
        try {
            if (!this.signer) {
                await this.setSigner(); // Ensure signer is set
            }
            if (!this.contract) {
                this.contract = new ethers.Contract(
                    TokenContractAddress,
                    ABI,
                    this.signer
                );
            }
        } catch (error) {
            console.error("Failed to initialize contract:", error);
            throw error; // Propagate error
        }
    }

    async mint(tokenURI) {
        // debugger;
        try {
            await this.initializeContract(); // Ensure contract is initialized

            const tx = await this.contract.mint(tokenURI, {
                value: ethers.parseEther("0.05") // Adjust the value according to your mintPrice in the contract
            });

            console.log(tx);
            await tx.wait();
            // debugger;
            console.log(`Token minted successfully. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Minting failed:", error);
            throw error; // Propagate error
        }
    }


    async setMaxSupply(maxSupply) {
        try {
            await this.initializeContract(); // Ensure contract is initialized

            const tx = await this.contract.setMaxSupply(maxSupply);
            await tx.wait();
            console.log(`Max supply set to ${maxSupply}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Setting max supply failed:", error);
            throw error; // Propagate error
        }
    }

    async setApprovalForAll(operator) {
        try {
            // debugger;
            // console.log(operator);
            await this.initializeContract(); // Ensure contract is initialized

            // Get the signer address
            const signer = await this.signer.getAddress();
            // console.log(signer)
            // Check if the operator is already approved
            const isAlreadyApproved = await this.contract.isApprovedForAll(signer, operator);
            console.log(isAlreadyApproved)
            if (isAlreadyApproved === true) {
                console.log(`Operator ${operator} is already ${true ? 'approved' : 'not approved'}.`);
                return;
            }

            // Proceed with setting approval
            const tx = await this.contract.setApprovalForAll(operator, true);
            await tx.wait();
            console.log(`Approval for operator ${operator} set to true. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Setting approval for all failed:", error);
            throw error; // Propagate error
        }
    }



    async setUser(tokenId, userAddress, expires) {
        try {
            await this.initializeContract(); // Ensure contract is initialized

            const tx = await this.contract.setUser(tokenId, userAddress, expires);
            await tx.wait();
            console.log(`User set successfully for tokenId ${tokenId}. Transaction: ${tx.hash}`);
        } catch (error) {
            console.error("Setting user failed:", error);
            throw error; // Propagate error
        }
    }

    async userOf(tokenId) {
        try {
            await this.initializeContract(); // Ensure contract is initialized

            const userAddress = await this.contract.userOf(tokenId);
            console.log(`User of tokenId ${tokenId} is: ${userAddress}`);
            return userAddress;
        } catch (error) {
            console.error("Fetching user failed:", error);
            throw error; // Propagate error
        }
    }

    async tokenURI(tokenId) {
        try {

            if (!this.contract) {
                await this.initializeContract(); // Ensure contract is initialized
            }
            console.log(tokenId);
            const uri = await this.contract.tokenURI(tokenId);
            console.log(uri);
            console.log(`Token URI of tokenId ${tokenId} is: ${uri}`);
            return uri;
        } catch (error) {
            console.error("Fetching token URI failed:", error);
            throw error; // Propagate error
        }
    }

    async userExpires(tokenId) {
        try {
            await this.initializeContract(); // Ensure contract is initialized

            const expires = await this.contract.userExpires(tokenId);
            console.log(`User expires for tokenId ${tokenId} at: ${expires}`);
            return expires;
        } catch (error) {
            console.error("Fetching user expiration failed:", error);
            throw error; // Propagate error
        }
    }
}


