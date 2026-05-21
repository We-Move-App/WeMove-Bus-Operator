import React, { useState, useRef, useEffect } from "react";

import styles from "./bus-license-upload.module.css";

import { Play, Pause, X, FilePlus, FileText } from "lucide-react";

import { useTranslation } from "react-i18next";

const BusLicenseUpload = ({
  formData,
  setFormData,
  title,
  uploadText,
  height,
  fieldKey,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef(null);

  const { t } = useTranslation();

  // =========================
  // START UPLOAD WHEN FILE CHANGES
  // =========================
  useEffect(() => {
    if (formData[fieldKey] && !formData[fieldKey]?.uploaded) {
      startUpload();
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [formData[fieldKey]]);

  // =========================
  // FILE CHANGE
  // =========================
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

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

        uploadProgress: 0,
        uploaded: false,
      },
    }));
  };

  // =========================
  // START UPLOAD
  // =========================
  const startUpload = () => {
    setIsPaused(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    simulateUpload();
  };

  // =========================
  // SIMULATE UPLOAD
  // =========================
  const simulateUpload = () => {
    intervalRef.current = setInterval(() => {
      setFormData((prevData) => {
        const currentFile = prevData[fieldKey];

        if (!currentFile) return prevData;

        const currentProgress = currentFile.uploadProgress || 0;

        if (currentProgress >= 100) {
          clearInterval(intervalRef.current);

          return prevData;
        }

        const newProgress = currentProgress + 5;

        return {
          ...prevData,

          [fieldKey]: {
            ...currentFile,

            uploadProgress: newProgress >= 100 ? 100 : newProgress,

            uploaded: newProgress >= 100,
          },
        };
      });
    }, 200);
  };

  // =========================
  // PAUSE
  // =========================
  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPaused(true);
  };

  // =========================
  // PLAY
  // =========================
  const handlePlay = () => {
    setIsPaused(false);

    simulateUpload();
  };

  // =========================
  // REMOVE FILE
  // =========================
  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setFormData((prev) => ({
      ...prev,
      [fieldKey]: null,
    }));

    setIsPaused(false);
  };

  // =========================
  // CURRENT FILE
  // =========================
  const currentFile = formData[fieldKey];

  const progress = currentFile?.uploadProgress || 0;

  return (
    <div className={styles.busLicenseUpload}>
      <div className={styles.content}>
        <h3>{title}</h3>
      </div>

      <div className={styles.uploadLicenseBlock}>
        {/* =========================
            UPLOAD BUTTON
        ========================= */}
        <div className={styles.uploadContainer}>
          <label
            className={styles.uploadButton}
            htmlFor={`upload-${fieldKey}`}
            style={{ height }}
          >
            <span
              className={`${styles.uploadText} ${
                currentFile ? styles.selectedFile : styles.uploadFile
              }`}
            >
              <FilePlus size={40} />

              {currentFile ? currentFile.name : uploadText}
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

        {/* =========================
            PROGRESS SECTION
        ========================= */}
        {currentFile && (
          <div className={styles.uploadProgress}>
            <div className={styles.imageFileBlock}>
              <div className={styles.fileIcon}>
                <FileText />
              </div>
            </div>

            <div className={styles.progressBlock}>
              {/* =========================
                  FILE INFO
              ========================= */}
              <div className={styles.fileInfo}>
                <span>{currentFile.name}</span>

                <div className={styles.controlButtons}>
                  {progress < 100 &&
                    (isPaused ? (
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
                    ))}

                  <button
                    className={`${styles.controlButton} ${styles.close}`}
                    onClick={handleClose}
                  >
                    <X />
                  </button>
                </div>
              </div>

              {/* =========================
                  PROGRESS BAR
              ========================= */}
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>

              {/* =========================
                  PROGRESS TEXT
              ========================= */}
              <div className={styles.progressControls}>
                <span>
                  {(
                    (currentFile.size * (progress / 100)) /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB {t("busLicense.of")}{" "}
                  {(currentFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>

                <div className={styles.progressText}>
                  {progress >= 100
                    ? t("busLicense.completed")
                    : `${t("busLicense.uploading")} ${progress}%`}
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
