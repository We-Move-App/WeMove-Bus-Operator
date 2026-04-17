import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const mobile = formData.mobile.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // NAME
    if (!name) {
      newErrors.name = t("signupForm.nameRequired");
      isValid = false;
    } else if (!/^[A-Za-z][A-Za-z\s]*$/.test(name)) {
      newErrors.name = t("signupForm.nameInvalid");
      isValid = false;
    } else if (name.length < 4) {
      newErrors.name = t("signupForm.nameMin");
      isValid = false;
    }

    // COMPANY
    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = t("signupForm.companyAddressRequired");
      isValid = false;
    }

    if (!formData.companyName?.trim()) {
      newErrors.companyName = t("signupForm.companyNameRequired");
      isValid = false;
    }

    if (!formData.branch?.trim()) {
      newErrors.branch = t("signupForm.branchRequired");
      isValid = false;
    }

    // MOBILE
    if (!mobile) {
      newErrors.mobile = t("signupForm.mobileRequired");
      isValid = false;
    } else if (!/^\d{9}$/.test(mobile)) {
      newErrors.mobile = t("signupForm.mobileInvalid");
      isValid = false;
    }

    // EMAIL
    if (!email) {
      newErrors.email = t("signupForm.emailRequired");
      isValid = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      newErrors.email = t("signupForm.emailInvalid");
      isValid = false;
    }

    // PASSWORD (STRONG)
    if (!password.trim()) {
      newErrors.password = t("signupForm.passwordRequired");
      isValid = false;
    } else {
      if (password.length < 6) {
        newErrors.password = t("signupForm.passwordMin");
        isValid = false;
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = t("signupForm.passwordUppercase");
        isValid = false;
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = t("signupForm.passwordLowercase");
        isValid = false;
      } else if (!/\d/.test(password)) {
        newErrors.password = t("signupForm.passwordNumber");
        isValid = false;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = t("signupForm.passwordSpecial");
        isValid = false;
      }
    }

    // CONFIRM PASSWORD
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t("signupForm.confirmPasswordRequired");
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("signupForm.passwordMismatch");
      isValid = false;
    }

    // OTP VERIFICATION
    if (!verifiedFields.mobile) {
      newErrors.mobile = t("signupForm.mobileVerifyRequired");
      isValid = false;
    }

    if (!verifiedFields.email) {
      newErrors.email = t("signupForm.emailVerifyRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
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
      branch: formData.branch,
    };
    console.log("Registration Payload:", payload);

    try {
      const response = await axiosInstance.post(
        "/bus-management/auth/register",
        payload,
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
        error.response?.data?.message || t("signupForm.registrationFailed");

      const isApprovedMessage =
        errorMessage.includes("approved") &&
        errorMessage.toLowerCase().includes("login");

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
    const value = otp?.trim();
    const isMobile = otpField === "mobile";

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [otpField]: t("signupForm.otpRequired"),
      }));
      return false;
    }

    if (!/^\d{4,6}$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [otpField]: t("signupForm.otpInvalidLength"),
      }));
      return false;
    }

    try {
      const payload = {
        [isMobile ? "phoneNumber" : "email"]: isMobile
          ? `+91${formData.mobile}`
          : formData.email,
        otp: value,
      };

      const endpoint = isMobile
        ? "/verification/verify-phone-otp"
        : "/verification/verify-email-otp";

      const response = await axiosInstance.put(endpoint, payload);

      if (response.status === 200 && response.data.success) {
        setVerifiedFields((prev) => ({ ...prev, [otpField]: true }));

        setErrors((prev) => ({
          ...prev,
          [otpField]: "",
        }));

        // Optional success message
        setSnackbar?.({
          open: true,
          message: t("signupForm.otpVerified"),
          severity: "success",
        });

        return true;
      } else {
        // INVALID OTP
        setErrors((prev) => ({
          ...prev,
          [otpField]: response.data.message || t("signupForm.otpInvalid"),
        }));
        return false;
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [otpField]:
          error.response?.data?.message || t("signupForm.otpVerifyFailed"),
      }));

      return false;
    }
  };

  // return {
  //   formData,
  //   setFormData,
  //   errors,
  //   setErrors,
  //   verifiedFields,
  //   setVerifiedFields,
  //   otpModalOpen,
  //   setOtpModalOpen,
  //   otpField,
  //   setOtpField,
  //   handleChange: (e) => {
  //     const { name, value } = e.target;

  //     let newValue = value;

  //     if (name === "mobile") {
  //       newValue = newValue.replace(/\D/g, "");
  //       newValue = newValue.slice(0, 9);
  //     }

  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: newValue,
  //     }));

  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [name]: "",
  //     }));
  //   },

  //   handleVerify: async (field) => {
  //     const value = formData[field];

  //     if (!value.trim()) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         [field]: `Enter a valid ${
  //           field === "mobile" ? "mobile number" : "email"
  //         } first.`,
  //       }));
  //       return;
  //     }

  //     if (field === "mobile" && !/^\d{9}$/.test(value)) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         mobile: "Invalid mobile number.",
  //       }));
  //       return;
  //     }

  //     if (
  //       field === "email" &&
  //       !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
  //     ) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         email: "Please enter a valid email address.",
  //       }));
  //       return;
  //     }

  //     try {
  //       const payload = {
  //         emailOrPhone: field === "mobile" ? `+91${value}` : value,
  //       };

  //       const response = await axiosInstance.post(
  //         "/verification/send-otp-email-phone",
  //         payload,
  //       );

  //       if (response.status === 200 && response.data.success) {
  //         setOtpField(field);
  //         setOtpModalOpen(true);
  //       } else {
  //         setErrors((prevErrors) => ({
  //           ...prevErrors,
  //           [field]:
  //             response.data.message || "OTP could not be sent. Try again.",
  //         }));
  //       }
  //     } catch (error) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         [field]:
  //           error.response?.data?.message || "Failed to send OTP. Try again.",
  //       }));
  //     }
  //   },
  //   validate,
  //   handleSubmit,
  //   handleOtpVerification,
  // };

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

      let newValue = value;

      // ✅ MOBILE: only digits + 9 limit
      if (name === "mobile") {
        newValue = newValue.replace(/\D/g, "").slice(0, 9);
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));

      // ✅ clear error on change
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    },

    handleVerify: async (field) => {
      const value = formData[field]?.trim();
      const isMobile = field === "mobile";

      // ✅ EMPTY CHECK (i18n)
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          [field]: t(
            isMobile
              ? "signupForm.enterValidMobileFirst"
              : "signupForm.enterValidEmailFirst",
          ),
        }));
        return;
      }

      // ✅ MOBILE VALIDATION (9 digits)
      if (isMobile && !/^\d{9}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          mobile: t("signupForm.mobileInvalid"),
        }));
        return;
      }

      // ✅ EMAIL VALIDATION
      if (
        !isMobile &&
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
      ) {
        setErrors((prev) => ({
          ...prev,
          email: t("signupForm.emailInvalid"),
        }));
        return;
      }

      try {
        const payload = {
          emailOrPhone: isMobile ? `+91${value}` : value,
        };

        const response = await axiosInstance.post(
          "/verification/send-otp-email-phone",
          payload,
        );

        if (response.status === 200 && response.data.success) {
          setOtpField(field);
          setOtpModalOpen(true);
        } else {
          setErrors((prev) => ({
            ...prev,
            [field]: response.data.message || t("signupForm.otpSendFailed"),
          }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [field]:
            error.response?.data?.message || t("signupForm.otpSendFailed"),
        }));
      }
    },

    validate,
    handleSubmit,
    handleOtpVerification,
  };
};

export default useSignUpForm;
