import React from "react";
import styles from "./alert.module.css";
import Alert from "@mui/material/Alert";

const AlertBox = () => {
  return (
    <div className={styles.belowSaveTitle}>
      <Alert
        variant="outlined"
        severity="success"
        className={styles.successAlert}
      >
        Your data has been saved successfully.
      </Alert>
    </div>
  );
};

export default AlertBox;
