import React from "react";
import { useSelector } from "react-redux";
import styles from "./progress-bar.module.css";

const ProgressBar = () => {
  const step = useSelector((state) => {
    return state.bus?.step;
  });
  return (
    <div className={styles.progressContainer}>
      {/* Step 1 */}
      <div className={`${styles.step} ${step >= 1 ? styles.completed : ""}`}>
        1
      </div>

      {/* Connecting Line */}
      <div
        className={`${styles.line} ${
          step >= 2 || step >= 4 ? styles.completed : ""
        }`}
      ></div>

      {/* Step 2 */}
      <div className={`${styles.step} ${step >= 2 ? styles.completed : ""}`}>
        2
      </div>
    </div>
  );
};

export default ProgressBar;
