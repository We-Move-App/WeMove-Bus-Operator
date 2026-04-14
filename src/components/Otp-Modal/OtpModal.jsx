import React, { useState } from "react";
import styles from "./otp-modal.module.css";
import LogInBtn from "../Button/LogInBtn";
import { MuiOtpInput } from "mui-one-time-password-input";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const OtpModal = ({ field, value, onClose, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const maskValue = (field, value) => {
    if (field === "mobile") {
      return `*** *** ${value.slice(-4)}`;
    } else if (field === "email") {
      const [name, domain] = value.split("@");
      const visiblePart = name.slice(
        0,
        Math.max(2, Math.floor(name.length * 0.3)),
      );
      const maskedPart = "*".repeat(name.length - visiblePart.length);
      return `${visiblePart}${maskedPart}@${domain}`;
    }
    return value;
  };

  const handleChange = (newOtp) => {
    setOtp(newOtp);
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError(t("otp.errors.invalidLength"));
      return;
    }

    setLoading(true);
    try {
      const success = await onVerified(otp);
      // console.log("OTP Verification Result:", success);
      if (success) {
        onClose();
      } else {
        setError(t("otp.errors.invalidOtp"));
      }
    } catch (err) {
      // console.error("OTP Verification Error:", err);
      setError(err.message || t("otp.errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <IconButton
          onClick={onClose}
          className={styles.closeBtn}
          fontSize="medium"
        >
          <CloseIcon />
        </IconButton>
        <div className={styles.modalContentBlock}>
          <div className={styles.modalHeader}>
            <h1>{t("otp.title")}</h1>
          </div>
          <p>{t("otp.description", { value: maskValue(field, value) })}</p>
          <MuiOtpInput
            length={4}
            value={otp}
            onChange={handleChange}
            autoFocus
            sx={{
              display: "flex",
              gap: "10px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none !important" },
                "&:hover fieldset": { border: "none !important" },
                "&.Mui-focused fieldset": { border: "none !important" },
              },
              "& input": {
                width: "clamp(50px, 7vw, 80px)",
                height: "clamp(50px, 7vw, 80px)",
                fontSize: "20px",
                textAlign: "center",
                borderRadius: "20px",
                border: "none !important",
                backgroundColor: "#EDEDED",
                boxShadow: "none !important",
                "&:focus": { boxShadow: "none !important" },
              },
            }}
          />
          {error && <p className={styles.errorText}>{error}</p>}{" "}
          {/* Show error if exists */}
          <p className={styles.resendText}>{t("otp.noCode")}</p>
          <p className={styles.resendCode}>{t("otp.resend")}</p>
          <LogInBtn
            data={loading ? t("otp.verifying") : t("otp.verify")}
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
