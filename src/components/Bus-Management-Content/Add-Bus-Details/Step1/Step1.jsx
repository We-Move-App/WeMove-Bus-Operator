import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
import { useTranslation } from "react-i18next";

const Step1 = ({ onNext, step, formData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
      showSnackbar(t("busStep1.validation.images"));
      return false;
    }

    if (!localFormData.busName?.trim()) {
      showSnackbar(t("busStep1.validation.busName"));
      return false;
    }

    if (!localFormData.busModelNumber?.trim()) {
      showSnackbar(t("busStep1.validation.busModel"));
      return false;
    }

    if (!localFormData.busRegNumber?.trim()) {
      showSnackbar(t("busStep1.validation.busReg"));
      return false;
    }

    if (!localFormData.runningDays || localFormData.runningDays.length === 0) {
      showSnackbar(t("busStep1.validation.runningDays"));
      return false;
    }

    if (!localFormData.amenities || localFormData.amenities.length === 0) {
      showSnackbar(t("busStep1.validation.amenities"));
      return false;
    }

    if (!localFormData.busLicenseFront) {
      showSnackbar(t("busStep1.validation.license"));
      return false;
    }

    if (uploadProgress < 100) {
      showSnackbar(t("busStep1.validation.uploadWait"));
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
      showSnackbar(t("busStep1.success"), "success");
    } catch (err) {
      showSnackbar(t("busStep1.error"), "error");
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
        heading={t("busStep1.heading")}
        belowHeadingComponent={<ProgressBar step={step} />}
        showSubHeading={true}
        subHeading={t("busStep1.subHeading")}
        showBreadcrumbs={true}
        breadcrumbs={t("busStep1.breadcrumbs")}
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
            title={t("busStep1.uploadLicense")}
            uploadText={t("busStep1.uploadFile")}
            height="98px"
            fieldKey="busLicenseFront"
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
          />

          <div className={styles.butonForward}>
            <CustomBtn
              label={isSubmitting ? t("busStep1.saving") : t("busStep1.next")}
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
