import React, { useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import LogInLeft from "../../components/Reusable/LogInLeft";
import RightSection from "../../components/Reusable/RightSection";
import LogInBtn from "../../components/Button/LogInBtn";
import InputForm from "../../components/Reusable/Form/InputForm";
import { Snackbar, Alert } from "@mui/material";
import useLogInForm from "../../hooks/useLogInForm";

const LogIn = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    errorMessage,
    setErrorMessage,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useLogInForm();

  const token = localStorage.getItem("dashboardAccessToken");
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="logInSection">
      <LogInLeft />
      <div className="rightSectionContainer">
        <div className="rightContentBlock">
          <RightSection
            heading="Log In Here"
            description="Welcome back to We Move All! Please login to your account."
          />

          <form onSubmit={handleSubmit} className="form">
            <div className="formFieldsContainer">
              <InputForm
                label="Email/Phone Number"
                type="tel"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                error={errors.emailOrPhone}
              />

              <InputForm
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />

              <div className="forgotContainer">
                <p>
                  <span
                    className="link-url"
                    onClick={() => navigate("/reset-password")}
                  >
                    Forgot Password?
                  </span>
                </p>
              </div>
            </div>

            <div className="formSubmitBtn">
              <LogInBtn data="Log In" type="submit" />

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

              <div className="formBottomNoteText">
                <p>
                  Don’t have an account?{" "}
                  <span
                    className="link-url"
                    onClick={() => navigate("/sign-up")}
                  >
                    Sign up
                  </span>{" "}
                  here
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
