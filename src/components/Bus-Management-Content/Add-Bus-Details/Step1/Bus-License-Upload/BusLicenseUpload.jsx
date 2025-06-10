import React, { useState, useRef, useEffect } from "react";
import styles from "./bus-license-upload.module.css";
import { Play, Pause, X, FilePlus, FileText } from "lucide-react";

const BusLicenseUpload = ({
  formData,
  setFormData,
  title,
  uploadText,
  height,
  fieldKey,
  uploadProgress,
  setUploadProgress,
}) => {
  // const [uploadProgress, setUploadProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (formData[fieldKey]) {
      startUpload();
    }
    return () => clearInterval(intervalRef.current);
  }, [formData[fieldKey]]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, and PDF files are allowed.");
        return;
      }

      const previewURL = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        [fieldKey]: {
          name: file.name,
          size: file.size,
          type: file.type,
          previewURL,
        },
      }));
    }
  };

  const startUpload = () => {
    setUploadProgress(0);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    simulateUpload();
  };

  const simulateUpload = () => {
    intervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handlePause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPaused(true);
  };

  const handlePlay = () => {
    setIsPaused(false);
    simulateUpload();
  };

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFormData((prev) => ({ ...prev, [fieldKey]: null }));
    setUploadProgress(0);
    setIsPaused(false);
  };

  return (
    <div className={styles.busLicenseUpload}>
      <div className={styles.content}>
        <h3>{title}</h3>
      </div>
      <div className={styles.uploadLicenseBlock}>
        <div className={styles.uploadContainer}>
          <label
            className={styles.uploadButton}
            htmlFor={`upload-${fieldKey}`}
            style={{ height }}
          >
            <span
              className={`${styles.uploadText} ${
                formData[fieldKey] ? styles.selectedFile : styles.uploadFile
              }`}
            >
              <FilePlus size={40} />
              {formData[fieldKey] ? formData[fieldKey].name : uploadText}
            </span>
            <input
              type="file"
              id={`upload-${fieldKey}`}
              accept="image/png, image/jpeg, image/jpg, application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {formData[fieldKey] && (
          <div className={styles.uploadProgress}>
            <div className={styles.imageFileBlock}>
              <div className={styles.fileIcon}>
                <FileText />
              </div>
            </div>
            <div className={styles.progressBlock}>
              <div className={styles.fileInfo}>
                <span>{formData[fieldKey].name}</span>
                <div className={styles.controlButtons}>
                  {isPaused ? (
                    <button
                      className={`${styles.controlButton} ${styles.play}`}
                      onClick={handlePlay}
                    >
                      <Play />
                    </button>
                  ) : (
                    <button
                      className={`${styles.controlButton} ${styles.pause}`}
                      onClick={handlePause}
                    >
                      <Pause />
                    </button>
                  )}
                  <button
                    className={`${styles.controlButton} ${styles.close}`}
                    onClick={handleClose}
                  >
                    <X />
                  </button>
                </div>
              </div>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className={styles.progressControls}>
                <span>
                  {(
                    (formData[fieldKey].size * (uploadProgress / 100)) /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB of {(formData[fieldKey].size / (1024 * 1024)).toFixed(2)}{" "}
                  MB
                </span>
                <div className={styles.progressText}>
                  Uploading... {uploadProgress}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusLicenseUpload;
