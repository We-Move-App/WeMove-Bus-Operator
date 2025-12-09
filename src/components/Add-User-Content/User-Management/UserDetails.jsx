import React, { useState, useEffect } from "react";
import styles from "./user-details.module.css";
import LayoutNew from "../../Layout-New/LayoutNew";
import ContentHeading from "../../Reusable/Content-Heading/ContentHeading";
import CheckBoxItem from "../../Reusable/Check-Box/CheckBoxItem";
import InputField from "../../Reusable/Input-Field/InputField";
import CustomBtn from "../../Reusable/Custom-Button/CustomBtn";
import axiosInstance from "../../../services/axiosInstance";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SnackbarNotification from "../../Reusable/Snackbar-Notification/SnackbarNotification";
import { Eye, EyeOff } from "lucide-react";

const UserDetails = () => {
  const location = useLocation();
  const existingUser = location.state?.user || null;
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    idNumber: "",
    dob: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // State for checkboxes
  const [permissions, setPermissions] = useState({
    dashboardManagement: true,
    busManagement: false,
    routeManagement: false,
    driverManagement: false,
    ticketManagement: false,
    walletManagement: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle checkbox changes
  const togglePermission = (permission) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission],
    });
  };

  useEffect(() => {
    if (!existingUser) return;

    const { fullName, phoneNumber, email, idNumber, dob } = existingUser;

    const userPermissions =
      existingUser?.authorities?.busOperatorAuthorities || [];

    console.log("Setting permissions from:", userPermissions);
    console.log("DOB being set as:", dob);

    setFormData({
      fullName: fullName || "",
      phoneNumber: phoneNumber || "",
      email: email || "",
      idNumber: idNumber || "",
      dob: dob ? new Date(dob).toISOString().slice(0, 10) : "",
      password: "",
    });

    setPermissions({
      dashboardManagement: true,
      busManagement: userPermissions.includes("busManagement"),
      routeManagement: userPermissions.includes("routeManagement"),
      driverManagement: userPermissions.includes("driverManagement"),
      ticketManagement: userPermissions.includes("ticketManagement"),
      walletManagement: userPermissions.includes("walletManagement"),
    });
  }, [existingUser]);

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.password ||
      !formData.idNumber ||
      !formData.dob
    ) {
      setSnackbar({
        open: true,
        message: "Kindly fill up all required details.",
        severity: "error",
      });
      return;
    }

    const today = new Date();
    const dobDate = new Date(formData.dob);
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setSnackbar({
        open: true,
        message: "User must be at least 18 years old.",
        severity: "error",
      });
      return;
    }

    const selectedPermissions = Object.keys(permissions).filter(
      (key) => permissions[key]
    );

    if (selectedPermissions.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one permission.",
        severity: "error",
      });
      return;
    }

    const companyName =
      localStorage.getItem("companyName") || "Unknown Company";

    const payload = {
      fullName: formData.fullName,
      companyName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      idNumber: formData.idNumber,
      dob: formData.dob,
      permissions: selectedPermissions,
      authorities: selectedPermissions,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    console.log("Payload:", payload);

    try {
      let response;
      if (existingUser?._id) {
        response = await axiosInstance.put(
          `/bus-operator/members/${existingUser._id}`,
          payload
        );
        console.log("User updated successfully:", response.data);
      } else {
        response = await axiosInstance.post(
          "/bus-operator/members/add",
          payload
        );
        console.log("User added successfully:", response.data);
      }

      setSnackbar({
        open: true,
        message: response.data?.message || "User saved successfully!",
        severity: "success",
      });

      navigate("/add-manage-user", { state: { shouldRefresh: true } });
    } catch (err) {
      console.error("Error adding user:", err);

      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          "Failed to save user. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <ContentHeading heading="Bus Management" showSubHeading={false} />
      <>
        <div className={styles.addUserGridContainer}>
          <section className={styles.managerDetails}>
            <h3>Manager Details</h3>
            <div className={styles.inputUserContainer}>
              <InputField
                layout="row"
                label="Name"
                value={formData.fullName}
                onChange={handleInputChange("fullName")}
              />
              <InputField
                label="Tel"
                layout="row"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
              <InputField
                label="Email"
                layout="row"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
              />
              <InputField
                label="ID Number"
                layout="row"
                value={formData.idNumber}
                onChange={handleInputChange("idNumber")}
              />
              <InputField
                label="Date of Birth"
                layout="row"
                type="date"
                value={formData.dob}
                onChange={handleInputChange("dob")}
              />
              <InputField
                label="Password"
                layout="row"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                rightIcon={
                  showPassword ? (
                    <Eye
                      onClick={() => setShowPassword(false)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowPassword(true)}
                      style={{ cursor: "pointer" }}
                    />
                  )
                }
              />
            </div>
          </section>

          <section className={styles.accessDetails}>
            <h3>Access Management</h3>
            <div className={styles.inputUserContainer}>
              <CheckBoxItem
                label="View Dashboard"
                checked={permissions.dashboardManagement}
                // onChange={() => togglePermission("dashboardManagement")}
                onChange={() => {}}
                disabled={true}
              />
              <CheckBoxItem
                label="Bus Management"
                checked={permissions.busManagement}
                onChange={() => togglePermission("busManagement")}
              />
              <CheckBoxItem
                label="Route Management"
                checked={permissions.routeManagement}
                onChange={() => togglePermission("routeManagement")}
              />
              <CheckBoxItem
                label="Driver Management"
                checked={permissions.driverManagement}
                onChange={() => togglePermission("driverManagement")}
              />
              <CheckBoxItem
                label="Ticket Management"
                checked={permissions.ticketManagement}
                onChange={() => togglePermission("ticketManagement")}
              />
              <CheckBoxItem
                label="Wallet"
                checked={permissions.walletManagement}
                onChange={() => togglePermission("walletManagement")}
              />
            </div>
          </section>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CustomBtn
            label={existingUser ? "Update" : "Save Details"}
            onClick={handleSubmit}
          />
        </div>
      </>
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
    </>
  );
};

export default UserDetails;
