import React, { useState, useEffect } from "react";
import styles from "./driver-details.module.css";
import ContentHeading from "../../Reusable/Content-Heading/ContentHeading";
import CustomBtn from "../../Reusable/Custom-Button/CustomBtn";
import AlertBox from "../../Reusable/Alert/AlertBox";
import { AiOutlinePlus } from "react-icons/ai";
import useFetch from "../../../hooks/useFetch";
import { useDispatch } from "react-redux";
import { addDriver } from "../../../redux/slices/driverSlice";
import DriverLicense from "../Driver-License-Upload/DriverLicense";
import SnackbarNotification from "../../Reusable/Snackbar-Notification/SnackbarNotification";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import { useTranslation } from "react-i18next";

const DriverDetails = () => {
  const { t } = useTranslation();

  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    busRegNumber: "",
    phoneNumber: "",
    driverLicenseFront: null,
    avatar: null,
  });

  const [buses, setBuses] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchBuses = async () => {
      const response = await fetchData("/bus-operator/buses/my-buses");

      if (response?.data?.buses && Array.isArray(response.data.buses)) {
        setBuses(response.data.buses);
      } else {
        setBuses([]);
      }
    };

    fetchBuses();
  }, [fetchData]);

  const dispatch = useDispatch();

  const handleSave = async () => {
    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.avatar ||
      !formData.driverLicenseFront
    ) {
      setSnackbar({
        open: true,
        message: t("driverDetails.validation"),
        severity: "warning",
      });
      return;
    }

    const token = localStorage.getItem("dashboardAccessToken");

    if (!token) {
      setSnackbar({
        open: true,
        message: t("driverDetails.validation"),
        severity: "warning",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("driver_license_front", formData.driverLicenseFront);
    formDataToSend.append("avatar", formData.avatar);

    try {
      await axiosInstance.post("/buses/drivers", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      setSnackbar({
        open: true,
        message: t("driverDetails.success"),
        severity: "success",
      });

      setTimeout(() => {
        navigate("/driver-management");
      }, 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || t("driverDetails.error"),
        severity: "error",
      });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage({ url: imageUrl });

      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  return (
    <>
      <ContentHeading
        heading={t("driverDetails.heading")}
        showSubHeading={true}
        showBreadcrumbs={true}
        breadcrumbs={t("driverDetails.breadcrumbs")}
      />

      <div className={styles.addDriverContainer}>
        <div className={styles.addDriverLeft}>
          <div className={styles.firstBlock}>
            <h3>{t("driverDetails.picture")}</h3>

            <div className={styles.imageDriver}>
              {image ? (
                <img
                  src={image.url}
                  alt="Uploaded"
                  className={styles.previewImage}
                />
              ) : (
                <label htmlFor="file-upload">
                  <AiOutlinePlus color="#008533" size={30} />
                </label>
              )}

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </div>
          </div>

          <div className={styles.secondBlock}>
            <div className={styles.inputBlock}>
              <h3>{t("driverDetails.driverName")}</h3>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className={styles.inputBlock}>
              <h3>{t("driverDetails.mobileNumber")}</h3>
              <input
                type="text"
                value={formData.phoneNumber}
                maxLength={9}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setFormData({ ...formData, phoneNumber: value });
                  }
                }}
                placeholder={t("driverDetails.phonePlaceholder")}
              />
            </div>
          </div>
        </div>

        <div className={styles.addDriverLicense}>
          <DriverLicense
            formData={formData}
            setFormData={setFormData}
            title={t("driverDetails.licenseTitle")}
            uploadText={t("driverDetails.upload")}
            height="253px"
            fieldKey="driverLicenseFront"
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
          />

          <div className={styles.alertMsgBox}>
            <CustomBtn
              label={t("driverDetails.save")}
              width="160px"
              onClick={handleSave}
              disabled={
                !formData.fullName ||
                !formData.busRegNumber ||
                !formData.phoneNumber ||
                !formData.avatar ||
                !formData.driverLicenseFront ||
                uploadProgress < 100
              }
            />
          </div>
        </div>
      </div>

      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
    </>
  );
};

export default DriverDetails;
