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

const DriverDetails = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { fetchData, loading, error } = useFetch();
  const [image, setImage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
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
    severity: "success", // 'success', 'error', 'warning', 'info'
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchBuses = async () => {
      const response = await fetchData("/bus-operator/buses/my-buses");
      console.log("Fetched Buses:", response);

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
      !formData.busRegNumber ||
      !formData.phoneNumber ||
      !formData.avatar ||
      !formData.driverLicenseFront
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields before saving.",
        severity: "warning",
      });
      return;
    }

    const token = localStorage.getItem("dashboardAccessToken");
    console.log(token);
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields before saving.",
        severity: "warning",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("busRegNumber", formData.busRegNumber);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("driver_license_front", formData.driverLicenseFront);
    formDataToSend.append("avatar", formData.avatar);

    console.log("🚀 FormData before sending:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(
        "http://192.168.0.208:8000/api/v1/buses/drivers",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Driver added successfully!",
          severity: "success",
        });

        // setShowAlert(true);
        // setFormData({
        //   fullName: "",
        //   busRegNumber: "",
        //   phoneNumber: "",
        //   driverLicenseFront: null,
        //   avatar: null,
        // });
        // setImage(null);
        setTimeout(() => {
          navigate("/driver-management");
        }, 1000);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Failed to add driver.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("❌ Error adding driver:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
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
        heading="Driver Management"
        showSubHeading={true}
        showBreadcrumbs={true}
        breadcrumbs="Add New Driver"
      />
      <div className={styles.addDriverContainer}>
        <div className={styles.addDriverLeft}>
          <div className={styles.firstBlock}>
            <h3>Picture</h3>
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
              <h3>Driver Name</h3>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className={`${styles.inputBlock} ${styles.inputNumber}`}>
              <h3>Bus Registration Number</h3>
              <select
                name="busRegNumber"
                value={formData.busRegNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    busRegNumber: e.target.value,
                  })
                }
              >
                <option value="">Select a Bus</option>
                {buses.map((bus) => (
                  <option key={bus._id} value={bus.busRegNumber}>
                    {bus.busRegNumber}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputBlock}>
              <h3>Mobile Number</h3>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.addDriverLicense}>
          <DriverLicense
            formData={formData}
            setFormData={setFormData}
            title="Add Driver License"
            uploadText="Drag and drop or browse your files"
            height="253px"
            fieldKey="driverLicenseFront"
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
          />
          <div className={styles.alertMsgBox}>
            <CustomBtn
              label="Save"
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
      {/* {showAlert && <AlertBox />} */}
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
    </>
  );
};

export default DriverDetails;
