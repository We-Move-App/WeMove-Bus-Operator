import React from "react";
import styles from "./check-box.module.css";
import { Check } from "lucide-react";

const CheckBoxItem = ({ label, checked, onChange }) => {
  return (
    <div className={styles.checkboxItem}>
      <div className={styles.checkboxLabel}>{label}</div>
      <div
        className={`${styles.checkbox} ${checked ? styles.checked : ""}`}
        onClick={onChange}
      >
        {checked && <Check size={20} />}
      </div>
    </div>
  );
};

export default CheckBoxItem;
