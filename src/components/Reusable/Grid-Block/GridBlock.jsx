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
import { useTranslation } from "react-i18next";

const GridBlock = ({ _id, image, busName, modelNumber, regNumber, driver }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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

      dispatch(
        setBusData({
          _id,
          busImages: [{ url: image }],
          busName,
          busModelNumber: modelNumber,
          busRegNumber: regNumber,
          assignedDriver: driver,
          routes: response.data?.data ? [response.data.data] : [],
        }),
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
        `/bus-operator/buses/delete-permanent/${_id}`,
      );

      setSnackbar({
        open: true,
        message: t("busManagement.deleteSuccess"),
        severity: "success",
      });

      setShowDeleteModal(false);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting bus:", error);
      setSnackbar({
        open: true,
        message: t("busManagement.deleteError"),
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
            {t("busManagement.busName")} :{" "}
            <span className={styles.title}>{busName}</span>
          </h4>

          <h4>
            {t("busManagement.busModelNumber")} :{" "}
            <span className={styles.title}>{modelNumber}</span>
          </h4>

          <h4>
            {t("busManagement.busRegistrationNumber")} :{" "}
            <span className={styles.title}>{regNumber}</span>
          </h4>

          <h4>
            {t("busManagement.assignedDriver")} :{" "}
            <span className={styles.title}>{driver}</span>
          </h4>

          <div className={styles.gridBtnBlock}>
            <CustomBtn
              label={t("busManagement.viewDetails")}
              onClick={handleViewDetails}
              className={styles.viewButton}
              width="152px"
            />

            <button
              onClick={() => setShowDeleteModal(true)}
              className={styles.deleteButton}
              title={t("busManagement.deleteBus")}
            >
              <Trash2 size={20} />
            </button>

            {showDeleteModal &&
              createPortal(
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h3>{t("busManagement.deleteBus")}</h3>

                    <p>{t("busManagement.deleteConfirm", { busName })}</p>

                    <div className={styles.modalActions}>
                      <button
                        className={styles.confirmBtn}
                        onClick={() => handleConfirmDelete(_id)}
                      >
                        {t("busManagement.delete")}
                      </button>

                      <button
                        className={styles.cancelBtn}
                        onClick={() => setShowDeleteModal(false)}
                      >
                        {t("busManagement.cancel")}
                      </button>
                    </div>
                  </div>
                </div>,
                document.body,
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
