import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogInLeft from "../../components/Reusable/LogInLeft";
import RightSection from "../../components/Reusable/RightSection";
import LogInBtn from "../../components/Button/LogInBtn";
import InputForm from "../../components/Reusable/Form/InputForm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OtpModal from "../../components/Otp-Modal/OtpModal";
import useSignUpForm from "../../hooks/useSignUpForm";
import SnackbarNotification from "../../components/Reusable/Snackbar-Notification/SnackbarNotification";
import BranchSelect from "../../components/Branch-Select/BranchSelect";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { t } = useTranslation();

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    verifiedFields,
    setVerifiedFields,
    otpModalOpen,
    setOtpModalOpen,
    otpField,
    setOtpField,
    handleChange,
    handleVerify,
    validate,
    handleSubmit,
    handleOtpVerification,
  } = useSignUpForm(
    {
      name: "",
      companyName: "",
      companyAddress: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      branch: "",
    },
    setSnackbar,
  );

  return (
    <div className="logInSection">
      <LogInLeft />
      <div className="rightSectionContainer">
        <div className="rightContentBlock">
          <RightSection
            heading={t("signup.heading")}
            description={t("signup.description")}
          />
          <form onSubmit={handleSubmit} className="form">
            <div className="formFieldsContainer">
              <InputForm
                label={t("signup.fullName")}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <InputForm
                label={t("signup.companyName")}
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                error={errors.companyName}
              />

              <InputForm
                label={t("signup.companyAddress")}
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                error={errors.companyAddress}
              />

              <BranchSelect
                label={t("signup.chooseBranch")}
                required={true}
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                onBlur={handleChange}
                error={errors.branch}
              />

              <div className="twoColumnInputContainer">
                <InputForm
                  label={t("signup.mobile")}
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={errors.mobile}
                  disabled={verifiedFields.mobile}
                  extraLabelContent={
                    !verifiedFields.mobile ? (
                      <span
                        className="verifyNowText"
                        onClick={() => handleVerify("mobile")}
                      >
                        <CheckCircleIcon fontSize="small" />
                        {t("signup.verifyNow")}
                      </span>
                    ) : (
                      <span className="verifiedText">
                        <CheckCircleIcon fontSize="small" />
                        {t("signup.verified")}
                      </span>
                    )
                  }
                />

                <InputForm
                  label={t("signup.email")}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={verifiedFields.email}
                  extraLabelContent={
                    !verifiedFields.email ? (
                      <span
                        className="verifyNowText"
                        onClick={() => handleVerify("email")}
                      >
                        <CheckCircleIcon fontSize="small" />
                        {t("signup.verifyNow")}
                      </span>
                    ) : (
                      <span className="verifiedText">
                        <CheckCircleIcon fontSize="small" />
                        {t("signup.verified")}
                      </span>
                    )
                  }
                />
              </div>

              <div className="twoColumnInputContainer">
                <InputForm
                  label={t("signup.password")}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />

                <InputForm
                  label={t("signup.confirmPassword")}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>
            </div>

            <div className="formSubmitBtn">
              <LogInBtn
                data={t("signup.signUpButton")}
                type="submit"
                disabled={!verifiedFields.mobile || !verifiedFields.email}
              />

              <div className="formBottomNoteText">
                <p>
                  {t("signup.alreadyAccount")}{" "}
                  <span className="link-url" onClick={() => navigate("/")}>
                    {t("signup.login")}
                  </span>{" "}
                  {t("signup.here")}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* OTP Modal */}
      {otpModalOpen && (
        <OtpModal
          field={otpField}
          value={formData[otpField]}
          onClose={() => setOtpModalOpen(false)}
          onVerified={async (otp) => {
            const success = await handleOtpVerification(otp);
            if (success) {
              setVerifiedFields((prev) => ({ ...prev, [otpField]: true }));
              setOtpModalOpen(false);
            }
            return success;
          }}
        />
      )}
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
    </div>
  );
};

export default SignUp;
