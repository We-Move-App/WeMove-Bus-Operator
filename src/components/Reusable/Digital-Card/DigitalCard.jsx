import React, { useEffect, useState } from "react";
import styles from "./digital-card.module.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";

const DigitalCard = ({ showMidContent = true, walletDetails }) => {
  const { t } = useTranslation();

  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false);

  const cardNumber = "1234 5678 9876 5432";

  const toggleCardNumberVisibility = () => {
    setIsCardNumberVisible(!isCardNumberVisible);
  };

  return (
    <div className={styles.digitalCardContainer}>
      <div className={styles.digitalCardContent}>
        <div className={styles.digitalCard}>
          <h4>{t("dashboard.digitalCard.title")}</h4>

          <div className={styles.digitalCardNumberBlock}>
            <div className={styles.cardNumber}>
              <span style={{ fontFamily: "monospace", letterSpacing: "0.5px" }}>
                {isCardNumberVisible
                  ? cardNumber
                  : t("dashboard.digitalCard.maskedNumber")}
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

        {showMidContent && walletDetails && (
          <div className={styles.midContent}>
            <h3>
              {walletDetails.balance.toLocaleString()} {walletDetails.currency}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalCard;
