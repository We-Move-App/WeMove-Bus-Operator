import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { setBusData } from "../../../../redux/slices/busSlice";
import ContentHeading from "../../../Reusable/Content-Heading/ContentHeading";
import styles from "./step1.module.css";
import ProgressBar from "../Progress-Bar/ProgressBar";
import BusInfo from "./Bus-Info/BusInfo";
import CustomBtn from "../../../Reusable/Custom-Button/CustomBtn";
import BusDays from "./Bus-Days/BusDays";
import BusAmenities from "./Bus-Amenities/BusAmenities";
import BusLicenseUpload from "./Bus-License-Upload/BusLicenseUpload";
import SnackbarNotification from "../../../Reusable/Snackbar-Notification/SnackbarNotification";
import { updateFormData, setStep } from "../../../../redux/slices/busSlice";
// import useFetch from "../../../../hooks/useFetch";

const Step1 = ({ onNext, step, formData }) => {
  const dispatch = useDispatch();
  // const { fetchData, loading } = useFetch();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localFormData, setLocalFormData] = useState(formData || {});
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "error" });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFormData = () => {
    if (
      !localFormData.busImages ||
      !Array.isArray(localFormData.busImages) ||
      localFormData.busImages.length < 3
    ) {
      showSnackbar("Please upload at least 3 bus images");
      return false;
    }

    if (!localFormData.busName?.trim()) {
      showSnackbar("Bus name is required");
      return false;
    }
    if (!localFormData.busModelNumber?.trim()) {
      showSnackbar("Bus model number is required");
      return false;
    }
    if (!localFormData.busRegNumber?.trim()) {
      showSnackbar("Bus registration number is required");
      return false;
    }
    if (!localFormData.runningDays || localFormData.runningDays.length === 0) {
      showSnackbar("Please select at least one running day");
      return false;
    }
    if (!localFormData.amenities || localFormData.amenities.length === 0) {
      showSnackbar("Please add at least one amenity");
      return false;
    }

    if (!localFormData.busLicenseFront) {
      showSnackbar("Please upload bus license");
      return false;
    }

    if (uploadProgress < 100) {
      showSnackbar("Please wait till upload is completed");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (isSubmitting) return;
    if (!validateFormData()) return;

    setIsSubmitting(true);

    try {
      dispatch(updateFormData(localFormData));
      dispatch(setStep(2));
      showSnackbar("Step 1 data saved!", "success");
    } catch (err) {
      showSnackbar("Failed to save data", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.stepContainer}>
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
      <ContentHeading
        heading="Bus Management"
        belowHeadingComponent={<ProgressBar step={step} />}
        showSubHeading={true}
        subHeading="Add Bus Details"
        showBreadcrumbs={true}
        breadcrumbs="Add Bus Details"
        rightComponent={""}
      />
      <div className={styles.addBusGrid}>
        <div className={styles.busInfoFlexBox}>
          <BusInfo data={localFormData} setData={setLocalFormData} />
        </div>
        <div className={styles.busInfoFlexBox}>
          <BusDays formData={localFormData} setFormData={setLocalFormData} />
          <BusAmenities
            formData={localFormData}
            setFormData={setLocalFormData}
          />
          <BusLicenseUpload
            formData={localFormData}
            setFormData={setLocalFormData}
            title="Add Bus License"
            uploadText="Upload File"
            height="98px"
            fieldKey="busLicenseFront"
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
          />
          <div className={styles.butonForward}>
            <CustomBtn
              label={isSubmitting ? "Saving..." : "Next"}
              // disabled={isSubmitting}
              disabled={isSubmitting || uploadProgress < 100}
              onClick={handleNext}
              width="160px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
