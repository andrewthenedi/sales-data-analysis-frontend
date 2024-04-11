import React, { useState } from "react";
import "./UploadModal.css"; // Import the CSS file for styling

function UploadModal({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await onFileUpload(formData);
      setUploadStatus("File uploaded successfully!");
    } catch (error) {
      if (error.response && error.response.data === "INVALID_DATE") {
        const userConfirmed = window.confirm(
          "Invalid date found. Proceed with default correction?"
        );
        if (!userConfirmed) {
          setUploadStatus(
            "Upload cancelled. Please correct the data and try again."
          );
          return;
        }
      }
      console.error("Upload error:", error);
      setUploadStatus("Failed to upload file. Please try again.");
    }
  };

  return (
    <div className="upload-modal">
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
      {uploadStatus && (
        <p
          className={`upload-status ${
            uploadStatus.startsWith("Failed") ? "error" : "success"
          }`}
        >
          {uploadStatus}
        </p>
      )}
    </div>
  );
}

export default UploadModal;
