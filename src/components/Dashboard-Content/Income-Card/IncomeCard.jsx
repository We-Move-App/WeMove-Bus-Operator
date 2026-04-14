import React, { useState, useEffect } from "react";
import styles from "./income-card.module.css";
import axiosInstance from "../../../services/axiosInstance";
import { useTranslation } from "react-i18next";

const IncomeCard = () => {
  const { t, i18n } = useTranslation();
  const [dailyIncome, setDailyIncome] = useState(null);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await axiosInstance.get(
          "/wallet/analytics?entity=busoperator&filter=daily",
        );

        const income = response.data?.data?.analytics?.[0]?.profit;
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
      <span className={styles.todayBadge}>
        {t("dashboard.incomeCard.today")}
      </span>

      <h4>{t("dashboard.incomeCard.perDayIncome")}</h4>

      <h2>
        {dailyIncome?.toLocaleString(
          i18n.language === "en" ? "en-IN" : "fr-FR",
        )}
      </h2>
    </div>
  );
};

export default IncomeCard;
