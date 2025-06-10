import React from "react";
import styles from "../Button/loginBtn.module.css";

const LogInBtn = ({ data, onClick, type = "button" }) => {
  return (
    <>
      <button className={styles.logBtn} onClick={onClick} type={type}>
        <p>{data}</p>
      </button>
    </>
  );
};

export default LogInBtn;
