import React from "react";
import styles from "./income-card.module.css";

const IncomeCard = () => {
  return (
    <div className={styles.incomeCardContainer}>
      <h4>Per Day Income</h4>
      <h2>$67,908,67</h2>
    </div>
  );
};

export default IncomeCard;
