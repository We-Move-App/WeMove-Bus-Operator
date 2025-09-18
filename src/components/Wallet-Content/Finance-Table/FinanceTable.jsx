import React, { useState } from "react";
import styles from "./finance-table.module.css";
import TransactionHistory from "../Transaction-History/TransactionHistory";
import BankDetails from "../Bank-Details/BankDetails";

const FinanceTable = () => {
  const [key, setKey] = useState(0);
  const [activeTab, setActiveTab] = useState("transactions");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setKey((prevKey) => prevKey + 1);
  };
  return (
    <div className={styles.financeTableContainer}>
      {/* Tab Buttons */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "transactions" ? styles.activeTab : ""
          }`}
          id={styles.btn1}
          onClick={() => handleTabChange("transactions")}
        >
          Transaction History
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "bankDetails" ? styles.activeTab : ""
          }`}
          id={styles.btn2}
          onClick={() => handleTabChange("bankDetails")}
        >
          Withdraw
        </button>
      </div>
      {/* Tab Content */}
      <div className={styles.tabContent} key={key}>
        {activeTab === "transactions" ? (
          <TransactionHistory />
        ) : (
          <BankDetails
            openOnMount={true}
            // onWithdrawComplete={() => handleTabChange("transactions")}
            onWithdrawComplete={() => {
              setActiveTab("transactions");
              setKey((prev) => prev + 1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FinanceTable;
