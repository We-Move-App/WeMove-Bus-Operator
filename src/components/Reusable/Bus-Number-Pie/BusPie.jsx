import React from "react";
import styles from "./bus-pie.module.css";

const BusPie = ({ busNumber, progress }) => {
  return (
    <div className={styles.busPieContainer}>
      <div className={styles.busPieContent}>
        <h2>
          Bus Number : <span>{busNumber}</span>
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
