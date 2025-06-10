import React, { useState } from "react";
import styles from "./digital-card.module.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DigitalCard = ({ showMidContent = true }) => {
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false);

  const cardNumber = "1234 5678 9876 5432";

  const toggleCardNumberVisibility = () => {
    setIsCardNumberVisible(!isCardNumberVisible);
  };
  return (
    <div className={styles.digitalCardContainer}>
      <div className={styles.digitalCardContent}>
        <div className={styles.digitalCard}>
          <h4>Digital Debit Card</h4>
          <div className={styles.digitalCardNumberBlock}>
            <div className={styles.cardNumber}>
              {isCardNumberVisible ? cardNumber : "**** **** **** ****"}
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

        {showMidContent && (
          <div className={styles.midContent}>
            <h3>12,000</h3>
          </div>
        )}

        <div className={styles.belowContent}>
          <h4>Exp: 06/25</h4>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
