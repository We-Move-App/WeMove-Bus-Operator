import React from "react";
import styles from "./bus-pie.module.css";
import { useTranslation } from "react-i18next";

const BusPie = ({ busNumber, progress }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.busPieContainer}>
      <div className={styles.busPieContent}>
        <h2>
          {t("dashboard.pieChart.busNumber")} : <span>{busNumber}</span>
        </h2>
        <p>{progress}%</p>
      </div>
      <div className={styles.busPieProgress}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
          data-progress={progress}
        ></div>
      </div>
    </div>
  );
};

export default BusPie;
