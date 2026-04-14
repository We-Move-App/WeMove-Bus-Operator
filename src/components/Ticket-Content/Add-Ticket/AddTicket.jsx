import React, { useState, useEffect } from "react";
import styles from "./add-ticket.module.css";
import ContentHeading from "../../Reusable/Content-Heading/ContentHeading";
import InputField from "../../Reusable/Input-Field/InputField";
import BusRoutesWithDate from "../Bus-Routes-With-Date/BusRoutesWithDate";
import CustomBtn from "../../Reusable/Custom-Button/CustomBtn";
import axiosInstance from "../../../services/axiosInstance";
import SnackbarNotification from "../../Reusable/Snackbar-Notification/SnackbarNotification";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddTicket = ({ formData = { routes: [] }, setFormData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [localFormData, setLocalFormData] = useState(
    formData || { routes: [] },
  );
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (setFormData) {
      setFormData(localFormData);
    }
  }, [localFormData, setFormData]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleProceed = async () => {
    const selectedRoute = localFormData.routes[0];

    if (
      !name ||
      !mobile ||
      !selectedRoute?.date ||
      !selectedRoute?.from ||
      !selectedRoute?.to ||
      !selectedRouteDetails?.busId?._id ||
      !selectedRouteDetails?._id
    ) {
      setSnackbar({
        open: true,
        message: t("addTicket.validation"),
        severity: "warning",
      });
      return;
    }

    const passengers = [
      {
        name,
        contactNumber: mobile,
        email,
      },
    ];

    const body = {
      busId: selectedRouteDetails.busId._id,
      routeId: selectedRouteDetails._id,
      passengers,
      noOfPassengers: passengers.length,
      journeyDate: selectedRoute.date,
      email,
      termAndConditions: true,
      from: selectedRoute.from,
      to: selectedRoute.to,
      price: selectedRouteDetails?.pricePerSeat,
    };

    try {
      await axiosInstance.post("/bus-operator/bookings", body);

      setSnackbar({
        open: true,
        message: t("addTicket.success"),
        severity: "success",
      });

      setTimeout(() => {
        navigate("/ticket-management");
      }, 1000);
    } catch (err) {
      console.error("Booking failed:", err);

      setSnackbar({
        open: true,
        message: t("addTicket.error"),
        severity: "error",
      });
    }
  };

  return (
    <>
      <ContentHeading
        heading={t("addTicket.heading")}
        showSubHeading={true}
        breadcrumbs={t("addTicket.breadcrumbs")}
        showBreadcrumbs={true}
      />

      <div className={styles.addTicketGrid}>
        <div className={styles.addTicketLeft}>
          <div className={styles.addTicketContainer}>
            <InputField
              label={t("addTicket.customerName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <InputField
              label={t("addTicket.mobileNumber")}
              type="tel"
              value={mobile}
              maxLength={9}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            />

            <InputField
              label={t("addTicket.email")}
              type="email"
              className={styles.emailField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <BusRoutesWithDate
            formData={localFormData}
            setFormData={setLocalFormData}
            showDate={true}
            showPrice={false}
            onRouteSelect={setSelectedRouteDetails}
          />
        </div>
      </div>

      <CustomBtn label={t("addTicket.proceed")} onClick={handleProceed} />

      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleCloseSnackbar}
      />
    </>
  );
};

export default AddTicket;
