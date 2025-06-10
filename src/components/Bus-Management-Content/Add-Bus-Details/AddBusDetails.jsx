import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setBusData,
  setStep,
  resetBusData,
} from "../../../redux/slices/busSlice";
import styles from "./add-bus-details.module.css";
import Step1 from "./Step1/Step1";
import Step2 from "./Step2/Step2";
import FormSummary from "./Form-Summary/FormSummary";

const AddBusDetails = () => {
  const dispatch = useDispatch();
  const step = useSelector((state) => state.bus?.step);
  const formData = useSelector((state) => state.bus.formData);

  // Step 1 Next
  const handleNext = (data) => {
    dispatch(setBusData(data));
    // console.log("Data in Step 1:", data);
    dispatch(setStep(2));
  };

  // Step 2 Submit
  const handleSubmit = (data) => {
    dispatch(
      setBusData({
        ...formData,
        ...data,
      })
    );
    dispatch(setStep(3));
  };

  // Handle going back to the previous step
  const handlePrevious = () => {
    if (step > 1) dispatch(setStep(step - 1));
  };

  return (
    <div className={styles.container}>
      {step === 1 && <Step1 formData={formData} onNext={handleNext} />}
      {step === 2 && (
        <Step2
          formData={formData}
          onSubmit={handleSubmit}
          onPrevious={handlePrevious}
        />
      )}
      {step === 3 && (
        <>
          {/* {console.log("Final formData passed to Step 3:", formData)} */}
          <FormSummary formData={formData} />
        </>
      )}
    </div>
  );
};

export default AddBusDetails;
