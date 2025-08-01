import React, { useState, useEffect } from "react";
import styles from "./income-card.module.css";
import axiosInstance from "../../../services/axiosInstance";

const IncomeCard = () => {
  const [dailyIncome, setDailyIncome] = useState(null);
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await axiosInstance.get(
          "/wallet/analytics?entity=busoperator&filter=daily"
        );
        console.log(
          "💰 Income API Response:",
          response.data.data.analytics[0].incoming
        );

        const income = response.data?.data?.analytics?.[0]?.incoming;
        setDailyIncome(income ?? 0);
      } catch (error) {
        console.error("❌ Error fetching income:", error);
        setDailyIncome(0);
      }
    };

    fetchIncomeData();
  }, []);
  return (
    <div className={styles.incomeCardContainer}>
      <h4>Per Day Income</h4>
      <h2>{dailyIncome?.toLocaleString("en-IN")}</h2>
    </div>
  );
};

export default IncomeCard;
