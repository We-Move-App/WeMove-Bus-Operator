import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setAuthToken } from "../services/axiosInstance";

const useLogInForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpField, setOtpField] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    // ✅ don’t clear global errorMessage here
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};
    const isValidPhone =
      /^\d{10}$/.test(formData.emailOrPhone) ||
      /^\+\d{12}$/.test(formData.emailOrPhone);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formData.emailOrPhone
    );

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or Mobile number is required.";
      isValid = false;
    } else if (!isValidPhone && !isValidEmail) {
      newErrors.emailOrPhone = "Invalid email or mobile number.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!validate()) return;

    try {
      let payload = { ...formData };

      // Check if emailOrPhone is a number or email
      if (payload.emailOrPhone) {
        const isNumber = /^\d+$/.test(payload.emailOrPhone.trim());

        if (isNumber) {
          if (!payload.emailOrPhone.startsWith("+91")) {
            payload.emailOrPhone = `+91${payload.emailOrPhone.trim()}`;
          }
        } else {
          payload.emailOrPhone = payload.emailOrPhone.trim();
        }
      }

      console.log("Sending data:", payload);

      const response = await axiosInstance.post(
        "/bus-management/auth/login",
        payload
      );

      console.log("Response:", response.data);

      if (response.status === 200 && response.data.success) {
        const { accessToken, refreshToken } = response.data.data;

        localStorage.setItem("dashboardAccessToken", accessToken);
        localStorage.setItem("dashboardRefreshToken", refreshToken);
        setAuthToken(accessToken);
        console.log("✅ Navigation triggered");
        navigate("/dashboard", { replace: true });
      } else {
        console.log("Login failed");
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      const status = error.response?.status;
      const messageFromServer = error.response?.data?.message;

      let message = messageFromServer || "Login failed. Try again.";

      if (status === 401) {
        message =
          "You have just registered yourself. Please wait for Admin's approval.";
      } else if (status === 500) {
        message = "Server error. Please try again later.";
      }
      setErrorMessage(message);
    }
  };

  const handleSendOtp = async () => {
    const value = formData.emailOrPhone.trim();

    if (!value) {
      setErrors({ emailOrPhone: "Email or Mobile number is required." });
      return;
    }

    if (!/^\d{10}$/.test(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors({ emailOrPhone: "Invalid email or mobile number." });
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/verification/send-otp-email-phone",
        { emailOrPhone: value }
      );

      if (response.data.success) {
        setOtpField("emailOrPhone");
        setOtpModalOpen(true);
      } else {
        setErrorMessage("Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error("OTP Send Error:", err);
      setErrorMessage(
        err.response?.data?.message || "Could not send OTP. Try again."
      );
    }
  };

  const handleOtpVerification = async (otp) => {
    const value = formData[otpField];

    try {
      const response = await axiosInstance.post(
        "bus-management/auth/verify-otp-without-auth",
        { [otpField]: value, otp }
      );

      if (response.data.success) {
        setSuccessMessage("OTP verified successfully.");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/update-password");
        }, 1000);
        return true;
      } else {
        setErrorMessage("Invalid OTP.");
        return false;
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);
      setErrorMessage(
        err.response?.data?.message || "OTP verification failed."
      );
      return false;
    }
  };

  return {
    formData,
    errors,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    handleSendOtp,
    otpModalOpen,
    setOtpModalOpen,
    otpField,
    formDataFieldValue: formData[otpField],
    handleOtpVerification,
  };
};

export default useLogInForm;
