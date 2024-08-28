import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Bottombar from "../Components/Bottombar";
import axios from "axios";
import { TokenClass } from "../EthersClasses/Token";
// require("dotenv").config();

function PropertyVerificationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [nftImage, setNftImage] = useState(null);
  const [metadataCounter, setMetadataCounter] = useState(0);
  const tokenClass = new TokenClass();
  2;
  useEffect(() => {
    // Load the last used metadata counter from local storage
    const savedCounter = localStorage.getItem("metadataCounter");
    if (savedCounter) {
      setMetadataCounter(parseInt(savedCounter));
    }
  }, []);

  const uploadToPinata = async (file, name) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pinataMetadata", JSON.stringify({ name }));

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: import.meta.env.VITE_REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env
            .VITE_REACT_APP_PINATA_SECRET_API_KEY,
        },
      }
    );

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  const createMetadata = (data, imageUrl) => {
    return {
      name: `Property ${metadataCounter}`,
      description: `Property at ${data.Address}`,
      image: imageUrl,
      attributes: [
        { trait_type: "Address", value: data.Address },
        { trait_type: "Legal Description", value: data.LegalDiscription },
        { trait_type: "Parcel/Lot Number", value: data.LotNumber },
        { trait_type: "Current Owner", value: data.OwnerName },
        { trait_type: "Previous Owner", value: data.PreviousOwner },
        { trait_type: "Purchase Price", value: data.Price },
        { trait_type: "Date of Purchase", value: data.Date },
        { trait_type: "Property Size", value: data.Size },
        { trait_type: "Zoning Information", value: data.ZoningInfo },
      ],
    };
  };

  const onSubmit = async (data) => {
    // debugger;
    try {
      // Upload NFT image to Pinata
      const imageFile = document.getElementById("nft-image").files[0];
      const imageUrl = await uploadToPinata(
        imageFile,
        `Property_Image_${metadataCounter}`
      );

      // Create metadata
      const metadata = createMetadata(data, imageUrl);

      // Upload metadata to Pinata
      const metadataFile = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });
      const metadataUrl = await uploadToPinata(
        metadataFile,
        `Property_Metadata_${metadataCounter}`
      );

      console.log("Metadata URL:", metadataUrl);

      // Increment and save metadata counter
      const newCounter = metadataCounter + 1;
      setMetadataCounter(newCounter);
      localStorage.setItem("metadataCounter", newCounter.toString());

      // You can add further processing here, such as saving to a database or blockchain
      await tokenClass.mint(metadataUrl);
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleNftImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setNftImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Bottombar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden p-6 flex">
          {/* NFT Image Dropdown */}
          <div className="w-1/3 pr-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              NFT Image
            </h3>
            <label
              htmlFor="nft-image"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-600 hover:bg-gray-100 dark:border-gray-500 dark:hover:border-gray-400 transition-colors duration-300 ease-in-out"
            >
              {nftImage ? (
                <img
                  src={nftImage}
                  alt="NFT"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-4 text-gray-400 dark:text-gray-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              )}
              <input
                id="nft-image"
                type="file"
                className="hidden"
                onChange={handleNftImageChange}
                accept="image/*"
              />
            </label>
          </div>

          {/* Property Verification Form */}
          <div className="w-2/3 pl-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Property Verification Form
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Property Details */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Property Details
                </h3>
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("Address", { required: true })}
                />
                {errors.Address && (
                  <span className="text-red-500">This field is required</span>
                )}

                <input
                  type="text"
                  placeholder="Legal Description"
                  className="w-full p-2 border rounded mt-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("LegalDiscription", { required: true })}
                />
                {errors.LegalDiscription && (
                  <span className="text-red-500">This field is required</span>
                )}

                <input
                  type="text"
                  placeholder="Parcel/Lot Number"
                  className="w-full p-2 border rounded mt-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("LotNumber", { required: true })}
                />
                {errors.LotNumber && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>

              {/* Ownership Information */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Ownership Information
                </h3>
                <input
                  type="text"
                  placeholder="Current Owner's Name"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("OwnerName", { required: true })}
                />
                {errors.OwnerName && (
                  <span className="text-red-500">This field is required</span>
                )}

                <input
                  type="text"
                  placeholder="Previous Owner (if applicable)"
                  className="w-full p-2 border rounded mt-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("PreviousOwner")}
                />
              </div>

              {/* Document Uploads */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Document Uploads
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Property Deed",
                    "Title Document",
                    "Tax Records",
                    "Owner ID",
                    "Mortgage Document",
                    "Property Survey",
                    "Insurance Document",
                  ].map((doc) => (
                    <div key={doc}>
                      <label
                        htmlFor={`dropzone-file-${doc}`}
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-600 hover:bg-gray-100 dark:border-gray-500 dark:hover:border-gray-400 transition-colors duration-300 ease-in-out"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {doc}
                          </p>
                        </div>
                        <input
                          id={`dropzone-file-${doc}`}
                          type="file"
                          className="hidden"
                          {...register(doc.toLowerCase().replace(/\s+/g, "_"))}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Additional Information
                </h3>
                <input
                  type="text"
                  placeholder="Purchase Price"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("Price", { required: true })}
                />
                {errors.Price && (
                  <span className="text-red-500">This field is required</span>
                )}

                <input
                  type="date"
                  placeholder="Date of Purchase"
                  className="w-full p-2 border rounded mt-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("Date", { required: true })}
                />
                {errors.Date && (
                  <span className="text-red-500">This field is required</span>
                )}

                <input
                  type="text"
                  placeholder="Property Size"
                  className="w-full p-2 border rounded mt-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("Size", { required: true })}
                />
                {errors.Size && (
                  <span className="text-red-500">This field is required</span>
                )}

                <input
                  type="text"
                  placeholder="Zoning Information"
                  className="w-full p-2 border rounded mt-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  {...register("ZoningInfo", { required: true })}
                />
                {errors.ZoningInfo && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Submit Verification
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PropertyVerificationForm;
