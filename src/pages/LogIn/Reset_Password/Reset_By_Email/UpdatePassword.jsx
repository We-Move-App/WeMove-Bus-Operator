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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      await axiosInstance.put("/bus-operator/reset-password-new", {
        emailOrPhone,
        password,
        confirmPassword,
      });

      setSnackbar({
        open: true,
        message: "Password updated successfully",
        severity: "success",
      });

      setFormData({ password: "", confirmPassword: "" });
      localStorage.removeItem("resetEmailOrPhone");

      // ✅ Navigate after short delay (so snackbar is visible)
      setTimeout(() => {
        navigate("/", {
          state: { successMessage: "Password updated successfully" },
        });
      }, 1500);
    } catch (error) {
      console.error("Password Reset API Error:", error.response?.data);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Something went wrong!",
        severity: "error",
      });
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

              <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => {
                  setSnackbar({ ...snackbar, open: false });
                  if (snackbar.severity === "success") {
                    navigate("/");
                  }
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  severity={snackbar.severity}
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  sx={{ width: "100%" }}
                >
                  {snackbar.message}
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
