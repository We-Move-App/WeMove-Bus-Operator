import React, { useState, useEffect } from "react";
import styles from "./bank-details.module.css";
import images from "../../../assets/image";
import CustomBtn from "../../Reusable/Custom-Button/CustomBtn";
import FormModal from "../../Reusable/Form-Modal/FormModal";
import axiosInstance from "../../../services/axiosInstance";
import SnackbarNotification from "../../Reusable/Snackbar-Notification/SnackbarNotification";
import { useTranslation } from "react-i18next";

const BankDetails = ({ openOnMount = false, onWithdrawComplete }) => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(openOnMount);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
        description: t("bank.withdrawDescription"),
      };

      await axiosInstance.post("/momo/withdraw", payload);

      setIsModalOpen(false);
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error("Withdraw failed:", error);

      const errorMessage =
        error?.response?.data?.message ||
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]) ||
        error?.message ||
        t("bank.errorFallback");

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  return (
    <div className={styles.bankDetailsContainer}>
      {/* Withdraw Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onWithdrawComplete?.();
        }}
        content={
          <div className={styles.formContainerModal}>
            <h2>{t("bank.withdrawTitle")}</h2>

            <input
              type="number"
              className={styles.inputField}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={t("bank.enterAmount")}
            />
          </div>
        }
        actionButton={
          <CustomBtn
            width="160px"
            label={t("bank.withdraw")}
            onClick={handleWithdraw}
          />
        }
        customClassName={styles.withdrawModal}
      />

      {/* Confirmation Modal */}
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

            <h3>{t("bank.successTitle")}</h3>

            <p>{t("bank.successMessage")}</p>
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
