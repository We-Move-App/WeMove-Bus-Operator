import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setAuthToken } from "../services/axiosInstance";
import { useTranslation } from "react-i18next";

const useLogInForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  // OTP
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpField, setOtpField] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "emailOrPhone") {
      if (/^\d/.test(value)) {
        newValue = value.replace(/\D/g, "").slice(0, 9);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    const isValidPhone = /^\d{9}$/.test(formData.emailOrPhone);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formData.emailOrPhone,
    );

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = t("LoginErrors.emailRequired");
      isValid = false;
    } else if (!isValidPhone && !isValidEmail) {
      newErrors.emailOrPhone = t("LoginErrors.invalidEmailPhone");
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = t("LoginErrors.passwordRequired");
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = t("LoginErrors.passwordMin");
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
          if (!payload.emailOrPhone.startsWith("+237")) {
            payload.emailOrPhone = `+237${payload.emailOrPhone.trim()}`;
          }
        } else {
          payload.emailOrPhone = payload.emailOrPhone.trim();
        }
      }

      console.log("Sending data:", payload);

      const response = await axiosInstance.post(
        "/bus-management/auth/login",
        payload,
      );

      console.log("Response:", response.data);

      // if (response.status === 200 && response.data.success) {
      //   const { accessToken, refreshToken } = response.data.data;

      //   localStorage.setItem("dashboardAccessToken", accessToken);
      //   localStorage.setItem("dashboardRefreshToken", refreshToken);
      //   setAuthToken(accessToken);
      //   console.log("Navigation triggered");
      //   navigate("/dashboard", { replace: true });
      if (response.status === 200 && response.data.success) {
        const { accessToken, refreshToken } = response.data.data;

        localStorage.setItem("dashboardAccessToken", accessToken);
        localStorage.setItem("dashboardRefreshToken", refreshToken);

        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));

        console.log("Decoded Token:", decodedToken);

        localStorage.setItem("userData", JSON.stringify(decodedToken));

        setAuthToken(accessToken);

        const role = decodedToken?.role;
        const permissions = decodedToken?.permissions || {};

        if (role === "bus-operator-member") {
          if (permissions.busManagement) {
            navigate("/bus-management", { replace: true });
          } else if (permissions.routeManagement) {
            navigate("/route-management", { replace: true });
          } else if (permissions.driverManagement) {
            navigate("/driver-management", { replace: true });
          } else if (permissions.ticketManagement) {
            navigate("/ticket-management", { replace: true });
          } else if (permissions.walletManagement) {
            navigate("/wallet-management", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        console.log("Login failed");
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      const status = error.response?.status;
      const messageFromServer = error.response?.data?.message;

      let message = messageFromServer || t("LoginErrors.loginFailed");

      if (status === 401) {
        message = t("LoginErrors.pendingApproval");
      } else if (status === 500) {
        message = t("LoginErrors.serverError");
      }
      setErrorMessage(message);
    }
  };

  const handleSendOtp = async () => {
    let value = formData.emailOrPhone.trim();

    if (!value) {
      setErrors({ emailOrPhone: t("LoginErrors.emailRequired") });
      return;
    }

    const isPhone = /^\d{9}$/.test(value);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isPhone && !isEmail) {
      setErrors({ emailOrPhone: t("LoginErrors.invalidEmailPhone") });
      return;
    }

    // Add Cameroon country code
    if (isPhone && !value.startsWith("+237")) {
      value = `+237${value}`;
    }

    try {
      console.log("Sending OTP to:", value);

      const response = await axiosInstance.post(
        "bus-management/auth/resend-otp-without-auth",
        { emailOrPhone: value },
      );

      if (response.data.success) {
        setOtpField("emailOrPhone");
        setOtpModalOpen(true);
      } else {
        setErrorMessage(t("LoginErrors.otpSendFailed"));
      }
    } catch (err) {
      console.error("OTP Send Error:", err);

      setErrorMessage(
        err.response?.data?.message || t("LoginErrors.otpSendFailed"),
      );
    }
  };

  const handleOtpVerification = async (otp) => {
    let value = formData[otpField]?.trim();

    const isPhone = /^\d{9}$/.test(value);

    // Add Cameroon country code
    if (isPhone && !value.startsWith("+237")) {
      value = `+237${value}`;
    }

    try {
      console.log("Verify OTP Payload:", {
        [otpField]: value,
        otp,
      });

      const response = await axiosInstance.post(
        "bus-management/auth/verify-otp-without-auth",
        { [otpField]: value, otp },
      );

      if (response.data.success) {
        setSuccessMessage(t("LoginErrors.otpVerified"));

        setTimeout(() => {
          setSuccessMessage("");
          navigate("/update-password");
        }, 1000);

        return true;
      } else {
        setErrorMessage(t("LoginErrors.invalidOtp"));
        return false;
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);

      setErrorMessage(
        err.response?.data?.message || t("LoginErrors.otpVerifyFailed"),
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
