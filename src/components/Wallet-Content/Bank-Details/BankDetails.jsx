import React, { useState, useEffect } from "react";
import styles from "./bank-details.module.css";
import images from "../../../assets/image";
import CustomBtn from "../../Reusable/Custom-Button/CustomBtn";
import FormModal from "../../Reusable/Form-Modal/FormModal";
import axiosInstance from "../../../services/axiosInstance";
import SnackbarNotification from "../../Reusable/Snackbar-Notification/SnackbarNotification";

const BankDetails = ({ openOnMount = false, onWithdrawComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(openOnMount);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(true);
  const [bankData, setBankData] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get("/bus-operator/banks/");
        setBankData(response.data.data.bank);
      } catch (error) {
        console.error("Failed to fetch bank details", error);
      }
    };

    fetchBankDetails();
  }, []);

  const handleWithdraw = async () => {
    try {
      const payload = {
        entity: "busOperator",
        amount: parseFloat(withdrawAmount),
        description: "Withdraw earnings from July bookings",
      };

      const response = await axiosInstance.post("/momo/withdraw", payload);

      console.log("Withdraw Success:", response.data);
      setIsModalOpen(false);
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error("Withdraw failed:", error);

      // extract backend error message safely
      const errorMessage =
        error?.response?.data?.message || // backend's "message"
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]) || // first error in array
        error?.message || // axios/network error
        "Withdrawal failed. Please try again."; // fallback

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  return (
    <div className={styles.bankDetailsContainer}>
      {/* First Modal - Withdrawal Form */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onWithdrawComplete?.();
        }}
        content={
          <div className={styles.formContainerModal}>
            <h2>Withdraw Amount</h2>
            {/* <input type="text" className={styles.inputField} /> */}
            <input
              type="number"
              className={styles.inputField}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
            />

            {/* <label className={styles.radioLabel}>
              <h3>Your Wallet</h3>
              <div className={styles.inputBlock}>
                <input
                  type="radio"
                  name="walletSelection"
                  checked={selectedOption}
                  onChange={() => setSelectedOption(true)}
                />

                <div className={styles.inputBlockContent}>
                  <h5>WeMove All </h5>
                  <p>12,000XAF</p>
                </div>
              </div>
            </label> */}
          </div>
        }
        actionButton={
          <CustomBtn width="160px" label="Withdraw" onClick={handleWithdraw} />
        }
        customClassName={styles.withdrawModal}
      />

      {/* Second Modal - Confirmation */}
      <FormModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          onWithdrawComplete?.();
        }}
        content={
          <div
            className={`${styles.formContainerModal} ${styles.formContainerCongrats}`}
          >
            <div className={styles.imageBlockCongrats}>
              <img src={images.congratsIcon} alt="" />
            </div>
            <h3> Congratulation! Successfully done.</h3>
            <p>
              We are thrilled to extend a warm welcome to all newcomers and
              returning members alike.
            </p>
          </div>
        }
        customClassName={styles.confirmModal}
      />
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default BankDetails;
