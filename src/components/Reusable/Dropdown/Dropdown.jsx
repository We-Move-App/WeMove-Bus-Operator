import React from "react";
import styles from "./dropdown.module.css";

const Dropdown = ({ heading, value, onChange, options }) => (
  <div className={styles.dropdownContainer}>
    <label>{heading}</label>
    <select className={styles.dropdown} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
