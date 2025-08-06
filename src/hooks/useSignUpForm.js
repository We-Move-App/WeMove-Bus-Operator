import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const useSignUpForm = (initialValues, setSnackbar) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [verifiedFields, setVerifiedFields] = useState({
    mobile: false,
    email: false,
  });
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpField, setOtpField] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    } else if (!/^[A-Za-z][A-Za-z\s]*$/.test(formData.name)) {
      newErrors.name =
        "Name must start with a letter and contain only letters and spaces.";
      isValid = false;
    } else if (formData.name.trim().length < 4) {
      newErrors.name = "Name must be at least 4 characters long.";
      isValid = false;
    }

    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = "Company address is required.";
      isValid = false;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Invalid mobile number.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Must include a special character.";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
    // console.log("Validation Errors:", newErrors);
    setErrors(newErrors);
    return isValid;
  };

  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const needsMobileVerification =
      formData.mobile.trim() && !verifiedFields.mobile;
    const needsEmailVerification =
      formData.email.trim() && !verifiedFields.email;

    if (needsMobileVerification || needsEmailVerification) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: needsMobileVerification
          ? "Please verify your mobile number."
          : prevErrors.mobile,
        email: needsEmailVerification
          ? "Please verify your email."
          : prevErrors.email,
      }));
      return;
    }

    const payload = {
      email: formData.email,
      fullName: formData.name,
      password: formData.password,
      phoneNumber: `+91${formData.mobile}`,
      companyAddress: formData.companyAddress,
      companyName: formData.companyName,
    };
    console.log("Registration Payload:", payload);

    try {
      const response = await axiosInstance.post(
        "/bus-management/auth/register",
        payload
      );

      const { success, data } = response.data;
      const accessToken = data?.accessToken;
      const refreshToken = data?.refreshToken;
      const verificationStatus = data?.user?.verificationStatus;

      if ((response.status === 201 || response.status === 200) && success) {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("verificationStatus", verificationStatus);
          setAuthToken(accessToken);
        }

        if (verificationStatus === "submitted") {
          navigate("/step");
        } else if (verificationStatus === "approved") {
          setSnackbar({
            open: true,
            message:
              "Your application is already approved. Redirecting to login...",
            severity: "success",
          });

          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: "Unexpected verification status received.",
          }));
        }
      }
    } catch (error) {
      console.error("❌ Registration Failed:", error);

      const errorMessage =
        error.response?.data?.message || "Registration failed. Try again.";

      const isApprovedMessage =
        errorMessage.includes("approved") &&
        errorMessage.toLowerCase().includes("login");

      // Check if the error status is 400 and the message is about approval
      if (error.response?.status === 400 && isApprovedMessage) {
        localStorage.setItem("verificationStatus", "approved");
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "success",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);

        return;
      }

      // Check for "under processing" error message
      if (
        error.response?.status === 400 &&
        errorMessage.toLowerCase().includes("under processing")
      ) {
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "info",
        });

        // Navigate to the login page immediately
        setTimeout(() => {
          console.log("Navigating to /");
          navigate("/");
        }, 4000);
        return;
      }

      // Handle other errors
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: errorMessage,
      }));

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleOtpVerification = async (otp) => {
    try {
      const payload = {
        [otpField === "mobile" ? "phoneNumber" : "email"]:
          otpField === "mobile" ? `+91${formData.mobile}` : formData.email,
        otp,
      };

      // console.log("Sending OTP Verification Payload:", payload);

      const endpoint =
        otpField === "mobile"
          ? "/verification/verify-phone-otp"
          : "/verification/verify-email-otp";

      const response = await axiosInstance.put(endpoint, payload);
      // console.log("OTP Verification Response:", response.data);

      if (response.status === 200 && response.data.success) {
        setVerifiedFields((prev) => ({ ...prev, [otpField]: true }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          [otpField]: "",
        }));
        return true;
      }
      return false;
    } catch (error) {
      // console.error(
      //   "OTP Verification Error:",
      //   error.response?.data || error.message
      // );
      return false;
    }
  };

  return {
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
    handleChange: (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    },
    handleVerify: async (field) => {
      const value = formData[field];

      if (!value.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: `Enter a valid ${field === "mobile" ? "mobile number" : "email"
            } first.`,
        }));
        return;
      }

      if (field === "mobile" && !/^\d{10}$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: "Invalid mobile number.",
        }));
        return;
      }

      if (
        field === "email" &&
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address.",
        }));
        return;
      }

      try {
        const payload = {
          emailOrPhone: field === "mobile" ? `+91${value}` : value,
        };

        const response = await axiosInstance.post(
          "/verification/send-otp-email-phone",
          payload
        );

        if (response.status === 200 && response.data.success) {
          setOtpField(field);
          setOtpModalOpen(true);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [field]:
              response.data.message || "OTP could not be sent. Try again.",
          }));
        }
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]:
            error.response?.data?.message || "Failed to send OTP. Try again.",
        }));
      }
    },
    validate,
    handleSubmit,
    handleOtpVerification,
  };
};

export default useSignUpForm;
