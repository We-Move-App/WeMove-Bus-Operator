import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./form-summary.module.css";
import StepOneSummary from "./Step-One-Summary/StepOneSummary";
import { useSelector } from "react-redux";

const FormSummary = ({ formData, step, onNext }) => {
  // console.log(
  //   "Updated Redux state:",
  //   useSelector((state) => state.bus.formData)
  // );

  // console.log("FormSummary received:", formData);
  const busId = formData?._id;
  return (
    <div className={styles.summaryContainer}>
      <StepOneSummary
        formData={formData}
        step={step}
        onNext={onNext}
        busId={busId}
      />
    </div>
  );
};

export default FormSummary;
