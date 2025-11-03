import React, { useState } from "react";
import styles from "./grid-block.module.css";
import CustomBtn from "../Custom-Button/CustomBtn";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../services/axiosInstance";
import { setBusData, setStep } from "../../../redux/slices/busSlice";
import { Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import DriverList from "../Driver-Dropdown-List/DriverList";
import SnackbarNotification from "../Snackbar-Notification/SnackbarNotification";

const GridBlock = ({ _id, image, busName, modelNumber, regNumber, driver }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "error", "info", "warning"
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleViewDetails = async () => {
    if (!_id) {
      console.error("Missing _id in GridBlock");
      return;
    }

    try {
      const response = await axiosInstance.get(`/buses/bus-routes/bus/${_id}`);

      // console.log("Bus Route Fetched:", response.data);

      dispatch(
        setBusData({
          _id,
          busImages: [{ url: image }],
          busName,
          busModelNumber: modelNumber,
          busRegNumber: regNumber,
          assignedDriver: driver,
          routes: response.data?.data ? [response.data.data] : [],
        })
      );

      dispatch(setStep(3));
      navigate("/bus-management/add-bus-details");
    } catch (error) {
      console.error("Error fetching bus routes:", error);
    }
  };

  const handleConfirmDelete = async (_id) => {
    try {
      const response = await axiosInstance.delete(
        `/bus-operator/buses/delete-permanent/${_id}`
      );
      console.log("Bus deleted successfully:", response.data);

      // Show snackbar notification
      setSnackbar({
        open: true,
        message: "Bus deleted successfully!",
        severity: "success",
      });

      setShowDeleteModal(false);

      // Refresh the page or re-fetch your data
      // Option 1: Simple page reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      // Option 2: Better approach: Re-fetch data from backend
      // await fetchBuses(); // if you have a fetch function to refresh data
    } catch (error) {
      console.error("Error deleting bus:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete the bus. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div className={styles.gridBlock}>
      <div className={styles.gridContent}>
        <div className={styles.busImageContainer}>
          <img src={image} alt={busName} className={styles.busImage} />
        </div>
        <div className={styles.busDetails}>
          <h4>
            Bus Name : <span className={styles.title}>{busName}</span>
          </h4>
          <h4>
            Bus Model Number :{" "}
            <span className={styles.title}>{modelNumber}</span>
          </h4>
          <h4>
            Bus Registration Number :{" "}
            <span className={styles.title}>{regNumber}</span>
          </h4>
          <h4>
            Assigned Driver : <span className={styles.title}>{driver}</span>
          </h4>
          {/* <DriverList
            contacts={[
              { id: 1, name: "Alice", mobile: "9876543210" },
              { id: 2, name: "Bob", mobile: "9123456789" },
            ]}
            onSelect={(c) => console.log("Selected:", c)}
          /> */}
          <div className={styles.gridBtnBlock}>
            <CustomBtn
              label="View Details"
              onClick={handleViewDetails}
              className={styles.viewButton}
              width="152px"
            />

            <button
              onClick={() => setShowDeleteModal(true)}
              className={styles.deleteButton}
              title="Delete Bus"
            >
              <Trash2 size={20} />
            </button>

            {showDeleteModal &&
              createPortal(
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h3>Delete Bus</h3>
                    <p>Are you sure you want to delete "{busName}"?</p>
                    <div className={styles.modalActions}>
                      <button
                        className={styles.confirmBtn}
                        onClick={() => handleConfirmDelete(_id)}
                      >
                        Delete
                      </button>

                      <button
                        className={styles.cancelBtn}
                        onClick={() => setShowDeleteModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>
        </div>
      </div>
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default GridBlock;
