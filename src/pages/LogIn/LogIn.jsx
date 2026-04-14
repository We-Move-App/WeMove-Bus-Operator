import React, { useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import LogInLeft from "../../components/Reusable/LogInLeft";
import RightSection from "../../components/Reusable/RightSection";
import LogInBtn from "../../components/Button/LogInBtn";
import InputForm from "../../components/Reusable/Form/InputForm";
import { Snackbar, Alert } from "@mui/material";
import useLogInForm from "../../hooks/useLogInForm";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
            heading={t("login.heading")}
            description={t("login.description")}
          />

          <form onSubmit={handleSubmit} className="form">
            <div className="formFieldsContainer">
              <InputForm
                label={t("login.emailOrPhone")}
                type="tel"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                error={errors.emailOrPhone}
              />

              <InputForm
                label={t("login.password")}
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
                    {t("login.forgotPassword")}
                  </span>
                </p>
              </div>
            </div>

            <div className="formSubmitBtn">
              <LogInBtn data={t("login.loginButton")} type="submit" />

              <Snackbar
                open={Boolean(errorMessage)}
                autoHideDuration={null}
                onClose={() => setErrorMessage("")}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert severity="error" onClose={() => setErrorMessage("")}>
                  {errorMessage}
                </Alert>
              </Snackbar>

              <div className="formBottomNoteText">
                <p>
                  {t("login.noAccount")}{" "}
                  <span
                    className="link-url"
                    onClick={() => navigate("/sign-up")}
                  >
                    {t("login.signUp")}
                  </span>{" "}
                  {t("login.here")}
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
