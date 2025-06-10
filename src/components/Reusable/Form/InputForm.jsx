import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const InputForm = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  extraLabelContent,
  disabled = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="inputBlock">
      <label htmlFor={name}>
        <div className="otpVerify">
          <p>
            {label}
            <span style={{ color: "red" }}>*</span>
          </p>
          {extraLabelContent && (
            <span className="extraLabelContent">{extraLabelContent}</span>
          )}
        </div>
      </label>
      <div className="inputWrapper">
        <input
          name={name}
          placeholder={placeholder}
          value={value}
          type={showPassword ? "text" : type}
          onChange={onChange}
          disabled={disabled}
          autoComplete="off"
          style={{ ...props.style }}
        />
        {type === "password" && (
          <span className="visibilityIcon" onClick={togglePasswordVisibility}>
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </span>
        )}
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default InputForm;
