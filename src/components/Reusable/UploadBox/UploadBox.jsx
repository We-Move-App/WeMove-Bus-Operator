import React, { useState, useEffect } from "react";
import styles from "./upload-box.module.css";
import images from "../../../assets/image";
import CloseIcon from "@mui/icons-material/Close";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const UploadBox = ({ selectedFile, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fileSize, setFileSize] = useState({ uploaded: 0, total: 0 });
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      startUpload();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [selectedFile]);

  const startUpload = () => {
    if (!selectedFile) return;

    setUploading(true);
    const totalSize = selectedFile.size;
    let uploaded = (progress / 100) * totalSize; 

    const id = setInterval(() => {
      if (paused) return; // Skip update if paused

      const increment = Math.min(totalSize / 20, totalSize - uploaded);
      uploaded += increment;

      setProgress(Math.round((uploaded / totalSize) * 100));
      setFileSize({
        uploaded: (uploaded / (1024 * 1024)).toFixed(2),
        total: (totalSize / (1024 * 1024)).toFixed(2),
      });

      if (uploaded >= totalSize) {
        clearInterval(id);
        setUploading(false);
      }
    }, 300);

    setIntervalId(id);
  };

  const handlePauseResume = () => {
    if (paused) {
      // Resume uploading
      setPaused(false);
      startUpload();
    } else {
      // Pause uploading
      setPaused(true);
      clearInterval(intervalId);
    }
  };

  const handleClose = () => {
    clearInterval(intervalId); // Clear upload interval
    setUploading(false);
    setProgress(0);
    setFileSize({ uploaded: 0, total: 0 });
    if (onClose) onClose(); // Notify parent component if provided
  };

  // Render only if a file is selected
  if (!selectedFile) {
    return null;
  }

  return (
    <div className={styles.uploadBox}>
      <div className={styles.imageFileBlock}>
        <img src={images.imageFile} alt="file-block" />
      </div>
      <div className={styles.fileNameBlock}>
        <div className={styles.fileName}>
          <h3>{selectedFile.name}</h3>
          <div className={styles.closeBtn}>
            {uploading ? (
              <span onClick={handlePauseResume}>
                {paused ? (
                  <PlayArrowIcon style={{ color: "#fff" }} fontSize="medium" />
                ) : (
                  <PauseIcon style={{ color: "#fff" }} fontSize="medium" />
                )}
              </span>
            ) : (
              <CloseIcon
                style={{ color: "#fff" }}
                fontSize="medium"
                onClick={handleClose}
              />
            )}
          </div>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className={styles.fileSize}>
          <h3>
            {fileSize.uploaded} MB of {fileSize.total} MB
          </h3>
          <h4>
            {uploading
              ? paused
                ? "Paused"
                : `Uploading... ${progress}%`
              : "Upload Complete!"}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default UploadBox;
