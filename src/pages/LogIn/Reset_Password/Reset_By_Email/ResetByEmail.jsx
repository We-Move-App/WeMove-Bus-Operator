import React from "react";
import "../../login.css";
import LogInBtn from "../../../../components/Button/LogInBtn";
import LogInLeft from "../../../../components/Reusable/LogInLeft";
import RightSection from "../../../../components/Reusable/RightSection";
import InputForm from "../../../../components/Reusable/Form/InputForm";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useLogInForm from "../../../../hooks/useLogInForm";
import OtpModal from "../../../../components/Otp-Modal/OtpModal";
import { useTranslation } from "react-i18next";

const ResetByEmail = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    formData,
    errors,
    errorMessage,
    setErrorMessage,
    handleChange,
    handleSubmit,
    handleSendOtp,
    otpModalOpen,
    setOtpModalOpen,
    otpField,
    formDataFieldValue,
    handleOtpVerification,
    successMessage,
    setSuccessMessage,
  } = useLogInForm();

  return (
    <div className="logInSection">
      <LogInLeft />

      <div className="rightSectionContainer">
        <div className="rightContentBlock">
          <RightSection
            heading={t("auth.reset.heading")}
            description={t("auth.reset.description")}
          />

          <form onSubmit={handleSubmit} className="form">
            <div className="formFieldsContainer">
              <InputForm
                label={t("auth.reset.input")}
                type="tel"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                error={errors.emailOrPhone}
              />

              <LogInBtn
                data={t("auth.reset.sendCode")}
                type="button"
                onClick={handleSendOtp}
              />
            </div>

            <div className="formSubmitBtn">
              <Snackbar
                open={Boolean(errorMessage)}
                autoHideDuration={4000}
                onClose={() => setErrorMessage("")}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert severity="error" onClose={() => setErrorMessage("")}>
                  {errorMessage}
                </Alert>
              </Snackbar>

              <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={4000}
                onClose={() => setSuccessMessage("")}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert severity="success" onClose={() => setSuccessMessage("")}>
                  {successMessage}
                </Alert>
              </Snackbar>
            </div>
          </form>
        </div>
      </div>

      {otpModalOpen && (
        <OtpModal
          field={otpField}
          value={formDataFieldValue}
          onClose={() => setOtpModalOpen(false)}
          onVerified={async (otp) => {
            const success = await handleOtpVerification(otp);

            if (success) {
              setOtpModalOpen(false);

              localStorage.setItem("resetEmailOrPhone", formData.emailOrPhone);

              navigate("/update-password", {
                state: { emailOrPhone: formData.emailOrPhone },
              });
            }

            return success;
          }}
        />
      )}
    </div>
  );
};

export default ResetByEmail;
