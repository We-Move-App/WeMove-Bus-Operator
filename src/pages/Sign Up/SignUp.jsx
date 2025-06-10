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

const SignUp = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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
      address: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    setSnackbar
  );

  return (
    <div className="logInSection">
      <LogInLeft />
      <div className="rightSectionContainer">
        <div className="rightContentBlock">
          <RightSection
            heading="Create Account"
            description="Welcome to We Move All! Please create your account here."
          />
          <form onSubmit={handleSubmit} className="form">
            <div className="formFieldsContainer">
              <InputForm
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <InputForm
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />

              <div className="twoColumnInputContainer">
                <InputForm
                  label="Mobile Number"
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
                        Verify Now
                      </span>
                    ) : (
                      <span className="verifiedText">
                        <CheckCircleIcon fontSize="small" />
                        Verified
                      </span>
                    )
                  }
                />

                <InputForm
                  label="E-mail Id"
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
                        Verify Now
                      </span>
                    ) : (
                      <span className="verifiedText">
                        <CheckCircleIcon fontSize="small" />
                        Verified
                      </span>
                    )
                  }
                />
              </div>

              <div className="twoColumnInputContainer">
                <InputForm
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />

                <InputForm
                  label="Confirm Password"
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
                data="Sign Up"
                type="submit"
                disabled={!verifiedFields.mobile || !verifiedFields.email}
              />

              <div className="formBottomNoteText">
                <p>
                  Already have an account?{" "}
                  <span className="link-url" onClick={() => navigate("/")}>
                    Log In
                  </span>{" "}
                  here
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
