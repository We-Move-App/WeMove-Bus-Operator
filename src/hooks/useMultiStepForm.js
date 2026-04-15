import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useTranslation } from "react-i18next";

const useMultiStepForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(() => {
    const storedStep = localStorage.getItem("activeStep");
    return storedStep ? parseInt(storedStep) : 0;
  });

  const [avatar, setAvatar] = useState(null);
  const [formData, setFormData] = useState(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Access token:", token);
    const storedFormData = localStorage.getItem("formData");
    return storedFormData
      ? JSON.parse(storedFormData)
      : {
          accountNumber: "",
          accountHolderName: "",
          bankName: "",
          identityCardNumber: "",
          businessLicenseNumber: "",
          bank_detail: null,
          national_identity_card_front: null,
          national_identity_card_back: null,
        };
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("activeStep", activeStep);
  }, [activeStep]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "businessLicenseNumber" && /[^a-zA-Z0-9]/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prevData) => ({
      ...prevData,
      [field]: file,
    }));
  };

  const handleAvatarUpload = async () => {
    if (!avatar) {
      setSnackbar({
        open: true,
        message: t("multiStep.avatarRequired"),
        severity: "error",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("avatar", avatar);

    try {
      await axiosInstance.put("/bus-operator/update-avatar", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("verificationStatus");
      localStorage.removeItem("formData");
      localStorage.removeItem("activeStep");

      navigate("/thank-you");
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || t("multiStep.avatarUploadFailed"),
        severity: "error",
      });
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("identityCardNumber", formData.identityCardNumber);
    formDataToSend.append(
      "businessLicenseNumber",
      formData.businessLicenseNumber,
    );

    if (formData.national_identity_card_front) {
      formDataToSend.append(
        "national_identity_card_front",
        formData.national_identity_card_front,
      );
    }
    if (formData.national_identity_card_back) {
      formDataToSend.append(
        "national_identity_card_back",
        formData.national_identity_card_back,
      );
    }

    try {
      await axiosInstance.put(
        "/bus-management/auth/verify-details",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setActiveStep((prevStep) => prevStep + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || t("multiStep.verifyFailed"),
        severity: "error",
      });
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      handleSubmit();
    } else if (activeStep === 1) {
      handleContinue();
    } else if (activeStep === 2) {
      handleAvatarUpload();
    }
  };

  const handleContinue = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("accountHolderName", formData.accountHolderName);
    formDataToSend.append("accountNumber", formData.accountNumber);
    formDataToSend.append("bankName", formData.bankName);

    if (formData.bank_detail) {
      formDataToSend.append("bank_detail", formData.bank_detail);
    }

    try {
      const response = await axiosInstance.post(
        "/bus-operator/banks/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSnackbar({
        open: true,
        message: t("multiStep.bankSuccess"),
        severity: "success",
      });

      setActiveStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error("Error submitting bank details:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || t("multiStep.bankSubmitFailed"),
        severity: "error",
      });
    }
  };

  const handleSkipStep = () => {
    setActiveStep(2);
  };

  return {
    activeStep,
    formData,
    avatar,
    setAvatar,
    handleChange,
    handleFileUpload,
    handleNext,
    handleContinue,
    handleSkipStep,
    snackbar,
    handleSnackbarClose,
  };
};

export default useMultiStepForm;
