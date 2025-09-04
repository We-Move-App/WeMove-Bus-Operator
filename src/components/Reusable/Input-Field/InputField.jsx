import React from "react";
import styles from "./input-field.module.css";

const InputField = ({
  label,
  type = "text",
  layout = "column",
  className,
  rightIcon,
  ...props
}) => {
  const containerStyle =
    layout === "row" ? styles.inputContainerRow : styles.inputContainer;

  return (
    <div className={`${containerStyle} ${className || ""}`}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input type={type} className={styles.input} {...props} />
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </div>
    </div>
  );
};

export default InputField;
