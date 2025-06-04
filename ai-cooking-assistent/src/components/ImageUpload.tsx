import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Camera } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  isProcessing,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="upload-container">
      <div
        {...getRootProps()}
        className={`upload-area ${isDragActive ? "drag-active" : ""} ${
          isProcessing ? "processing" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="upload-content">
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              <p>Processing your image...</p>
            </>
          ) : (
            <>
              <Upload className="upload-icon" size={48} />
              <h3>Upload Ingredients Photo</h3>
              <p>
                {isDragActive
                  ? "Drop your image here..."
                  : "Drag and drop an image here, or click to select"}
              </p>
              <div className="upload-tips">
                <Camera size={16} />
                <span>
                  Take a clear photo of your ingredients for best results
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
