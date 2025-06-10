import React, { useEffect, useState } from "react";
import "../../login.css";
import LogInLeft from "../../../../components/Reusable/LogInLeft";
import RightSection from "../../../../components/Reusable/RightSection";
import InputForm from "../../../../components/Reusable/Form/InputForm";
import LogInBtn from "../../../../components/Button/LogInBtn";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../../services/axiosInstance";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const emailOrPhoneFromLocation = location.state?.emailOrPhone;

  const emailOrPhoneFromStorage = localStorage.getItem("resetEmailOrPhone");

  const emailOrPhone = emailOrPhoneFromLocation || emailOrPhoneFromStorage;

  useEffect(() => {
    if (!emailOrPhone) {
      setErrorMessage("Email or phone is missing. Please try again.");
      navigate("/reset-password");
    }
  }, [emailOrPhone]);
  console.log("Received emailOrPhone from location:", emailOrPhone);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    const newErrors = {};

    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!emailOrPhone) {
      setErrorMessage("Email or Phone is missing. Please try again.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        "/bus-operator/reset-password-new",
        {
          emailOrPhone,
          password,
          confirmPassword,
        }
      );

      setSuccessMessage("Password reset successfully");
      setFormData({
        password: "",
        confirmPassword: "",
      });

      localStorage.removeItem("resetEmailOrPhone");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Password Reset API Error:", error.response?.data);
      setErrorMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="logInSection">
      <LogInLeft />
      <div className="rightSectionContainer">
        <div className="rightContentBlock">
          <RightSection
            heading="Update Your Password"
            description="Set your new password below."
          />

          <form className="form" onSubmit={handleSubmit}>
            <div className="formFieldsContainer">
              <InputForm
                label="New Password"
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

            <div className="formSubmitBtn">
              <LogInBtn data="Continue" type="submit" />

              {/* Error Snackbar */}
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

              {/* Success Snackbar */}
              <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={3000}
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
    </div>
  );
};

export default UpdatePassword;
