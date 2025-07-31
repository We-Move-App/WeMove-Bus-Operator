import { useParams, useNavigate } from "react-router-dom";
import ContentHeading from "../../components/Reusable/Content-Heading/ContentHeading";
import styles from "./assign-driver.module.css";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import axiosInstance from "../../services/axiosInstance";
import BusManagementForm from "../../components/Bus-Management-Form/BusManagementForm";
import CustomBtn from "../../components/Reusable/Custom-Button/CustomBtn";
import SnackbarNotification from "../../components/Reusable/Snackbar-Notification/SnackbarNotification";

const AssignDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [busFormData, setBusFormData] = useState({
    busName: "",
    busModel: "",
    busRegistrationNumber: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  useEffect(() => {
    const fetchDriverImage = async () => {
      try {
        const res = await axiosInstance.get(`buses/drivers/${id}`);
        console.log("Driver Data:", res.data.fullName);
        setDriverData(res.data.data);
        const imageUrl = res?.data?.data?.avatar?.url;

        if (imageUrl) {
          setImage({ url: imageUrl });
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchDriverImage();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage({ url, file });
    }
  };

  const handleAssignDriver = async () => {
    try {
      const payload = {
        busRegNumber: busFormData.busRegistrationNumber,
        driverPhoneNumber: driverData.phoneNumber,
      };

      const response = await axiosInstance.put(
        "/buses/drivers/assign-driver",
        payload
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Driver assigned successfully!",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/driver-management");
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: "Failed to assign driver.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error assigning driver:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong while assigning driver.",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <ContentHeading
        heading="Driver Management"
        showSubHeading={false}
        showBreadcrumbs={true}
        breadcrumbs="Assign Driver"
      />

      <div className={styles.addDriverContainer}>
        <div className={styles.addDriverLeft}>
          <div className={styles.firstBlock}>
            <div className={styles.imageDriver}>
              {driverData?.avatar ? (
                <img
                  src={driverData.avatar.url}
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
            <div className={styles.driverDetails}>
              <h3>{driverData?.fullName}</h3>
              <p>{driverData?._id}</p>
              <p>Phone: {driverData?.phoneNumber}</p>
            </div>
          </div>
        </div>

        <BusManagementForm
          formData={busFormData}
          setFormData={setBusFormData}
        />

        <CustomBtn
          label="Assign Driver"
          onClick={handleAssignDriver}
          className={styles.viewButton}
          width="152px"
        />
      </div>

      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};

export default AssignDriver;
