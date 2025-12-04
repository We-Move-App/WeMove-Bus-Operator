import React, { useEffect, useState } from "react";
import styles from "./digital-card.module.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axiosInstance from "../../../services/axiosInstance";

const DigitalCard = ({ showMidContent = true }) => {
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false);

  const cardNumber = "1234 5678 9876 5432";

  const toggleCardNumberVisibility = () => {
    setIsCardNumberVisible(!isCardNumberVisible);
  };
  const [walletDetails, setWalletDetails] = useState(null);
  useEffect(() => {
    const fetchAnalyticsAndWallet = async () => {
      try {
        const walletRes = await axiosInstance.get("/wallet/details");
        setWalletDetails(walletRes.data.data);
        console.log("Wallet Details:", walletRes.data.data);
      } catch (error) {
        console.error("Error fetching wallet details", error);
      }
    };

    fetchAnalyticsAndWallet();
  }, []);

  return (
    <div className={styles.digitalCardContainer}>
      <div className={styles.digitalCardContent}>
        <div className={styles.digitalCard}>
          <h4>Digital Debit Card</h4>
          <div className={styles.digitalCardNumberBlock}>
            <div className={styles.cardNumber}>
              {/* {isCardNumberVisible ? cardNumber : "**** **** **** ****"} */}
              <span style={{ fontFamily: "monospace", letterSpacing: "0.5px" }}>
                {isCardNumberVisible ? cardNumber : "**** **** **** ****"}
              </span>
            </div>
            <div onClick={toggleCardNumberVisibility} className={styles.icon}>
              {isCardNumberVisible ? (
                <VisibilityIcon sx={{ color: "#fff", fontSize: "30px" }} />
              ) : (
                <VisibilityOffIcon sx={{ color: "#fff", fontSize: "30px" }} />
              )}
            </div>
          </div>
        </div>

        {/* {showMidContent && (
          <div className={styles.midContent}>
            <h3>{walletDetails.balance.toLocaleString()}</h3>
          </div>
        )} */}
        {showMidContent && walletDetails && (
          <div className={styles.midContent}>
            <h3>
              {walletDetails.balance.toLocaleString()} {walletDetails.currency}
            </h3>
          </div>
        )}

        {/* <div className={styles.belowContent}>
          <h4>Exp: 06/25</h4>
        </div> */}
      </div>
    </div>
  );
};

export default DigitalCard;
