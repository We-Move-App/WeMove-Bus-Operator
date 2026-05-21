import React, { useRef } from "react";
import styles from "./driver-license-upload.module.css";
import { X, FilePlus, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const DriverLicense = ({
  formData,
  setFormData,
  title,
  uploadText,
  height,
  fieldKey,
  uploadProgress,
  setUploadProgress,
  isSaving,
  setIsFileReady,
}) => {
  const { t } = useTranslation();

  const fileInputRef = useRef(null);

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
      alert(t("driverLicense.invalidFile"));

      return;
    }

    // first upload completed visually
    setUploadProgress(100);

    setIsFileReady(true);

    setFormData((prev) => ({
      ...prev,
      [fieldKey]: file,
    }));
  };

  const handleClose = () => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: null,
    }));

    setUploadProgress(0);

    setIsFileReady(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              ref={fileInputRef}
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
                  <button
                    className={`${styles.controlButton} ${styles.close}`}
                    onClick={handleClose}
                    disabled={isSaving}
                  >
                    <X />
                  </button>
                </div>
              </div>

              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>

              <div className={styles.progressControls}>
                <span>
                  {(
                    (formData[fieldKey].size * (uploadProgress / 100)) /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB {t("busLicense.of")}{" "}
                  {(formData[fieldKey].size / (1024 * 1024)).toFixed(2)} MB
                </span>

                <div className={styles.progressText}>
                  {isSaving
                    ? `${t("driverLicense.uploading")} ${uploadProgress}%`
                    : uploadProgress === 100
                      ? t("driverLicense.completed")
                      : t("driverLicense.ready")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverLicense;
