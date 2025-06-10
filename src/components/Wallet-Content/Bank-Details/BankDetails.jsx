import React, { useState, useEffect } from "react";
import styles from "./bank-details.module.css";
import images from "../../../assets/image";
import CustomBtn from "../../Reusable/Custom-Button/CustomBtn";
import FormModal from "../../Reusable/Form-Modal/FormModal";
import axiosInstance from "../../../services/axiosInstance";

const BankDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(true);
  const [bankData, setBankData] = useState(null);

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

  return (
    <div className={styles.bankDetailsContainer}>
      <div className={styles.mainHeading}>
        <h5>Bank Details</h5>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label>Bank Name</label>
          <input
            type="text"
            className={styles.inputField}
            value={bankData?.bankName || ""}
            placeholder="Bank of Africa"
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label>Bank Account Number</label>
          <input
            type="text"
            className={styles.inputField}
            placeholder="26578901YUOP"
            value={bankData?.accountNumber || ""}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label>Account Holder Name</label>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Hamidu"
            value={bankData?.accountHolderName || ""}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label>Bank Account Details</label>
          <div className={styles.viewField}>
            <div className={styles.uploadIconBlock}>
              <img src={images.uploadIcon} alt="upload-icon" />
            </div>
            <h3>
              {" "}
              <a
                href={bankData?.bankDocs?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View file
              </a>
            </h3>
          </div>
        </div>
      </div>
      <div className={styles.withDrawBtnBlock}>
        <CustomBtn
          width="160px"
          label="Withdraw"
          className={styles.withdrawBtn}
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* First Modal - Withdrawal Form */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={
          <div className={styles.formContainerModal}>
            <h2>Withdraw Amount</h2>
            <input type="text" className={styles.inputField} />

            <label className={styles.radioLabel}>
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
            </label>
          </div>
        }
        actionButton={
          <CustomBtn
            width="160px"
            label="Withdraw"
            onClick={() => {
              setIsModalOpen(false);
              setIsConfirmModalOpen(true);
            }}
          />
        }
        customClassName={styles.withdrawModal}
      />

      {/* Second Modal - Confirmation */}
      <FormModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
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
    </div>
  );
};

export default BankDetails;
