import React, { useState } from "react";
import { TokenClass } from "../EthersClasses/Token";

const NFT = () => {
  const [tokenId, setTokenId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const fetchNFTData = async () => {
    try {
      setError(""); // Clear previous errors
      const Manager = new TokenClass();
      const tokenUri = await Manager.tokenURI(tokenId);

      const response = await fetch(tokenUri);
      if (!response.ok) {
        throw new Error("Failed to fetch the token URI");
      }

      const metadata = await response.json();
      if (metadata.image) {
        setImageUrl(metadata.image);
      } else {
        setError("No image found in the token metadata");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "300px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3>NFT Viewer</h3>
      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="Enter Token ID"
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      />
      <button
        onClick={fetchNFTData}
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Fetch NFT
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img
            src={imageUrl}
            alt="NFT"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
};

export default NFT;
