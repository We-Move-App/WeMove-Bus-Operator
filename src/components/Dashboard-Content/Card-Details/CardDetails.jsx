import React from "react";
import styles from "./card-details.module.css";
import DigitalCard from "../../Reusable/Digital-Card/DigitalCard";
import IncomeCard from "../Income-Card/IncomeCard";

const CardDetails = ({ showIncomeCard, hideMidContent, walletDetails }) => {
  return (
    <div className={styles.cardDetails}>
      <DigitalCard
        showMidContent={!hideMidContent}
        walletDetails={walletDetails}
      />
      {showIncomeCard && <IncomeCard />}
    </div>
  );
};

export default CardDetails;
