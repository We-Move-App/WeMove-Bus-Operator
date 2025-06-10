import React from "react";
import styles from "./transaction-history.module.css";
import TransactionTable from "./Table/TransactionTable";

const TransactionHistory = () => {
  return (
    <div className={styles.transactionHistoryContainer}>
      <TransactionTable />
    </div>
  );
};

export default TransactionHistory;
