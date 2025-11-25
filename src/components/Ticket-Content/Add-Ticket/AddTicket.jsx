import React, { useState, useEffect } from "react";
import styles from "./add-ticket.module.css";
import ContentHeading from "../../Reusable/Content-Heading/ContentHeading";
import InputField from "../../Reusable/Input-Field/InputField";
import BusRoutesWithDate from "../Bus-Routes-With-Date/BusRoutesWithDate";
import images from "../../../assets/image";
import CustomBtn from "../../Reusable/Custom-Button/CustomBtn";
import axiosInstance from "../../../services/axiosInstance";
import SnackbarNotification from "../../Reusable/Snackbar-Notification/SnackbarNotification";
import { useNavigate } from "react-router-dom";

const AddTicket = ({ formData = { routes: [] }, setFormData }) => {
  const navigate = useNavigate();
  const [localFormData, setLocalFormData] = useState(
    formData || { routes: [] }
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
    // console.log("Updated localFormData:", localFormData);
    if (setFormData) {
      setFormData(localFormData);
    }
  }, [localFormData]);

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
        message: "Please fill in all required fields.",
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
      passengers: passengers,
      noOfPassengers: passengers.length,
      journeyDate: selectedRoute.date,
      email: email,
      termAndConditions: true,
      from: selectedRoute.from,
      to: selectedRoute.to,
      price: selectedRouteDetails?.pricePerSeat,
    };

    try {
      const res = await axiosInstance.post("/bus-operator/bookings", body);
      setSnackbar({
        open: true,
        message: "Ticket booked successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/ticket-management");
      }, 1000);
      // console.log("Booking response:", res.data);
    } catch (err) {
      console.error("Booking failed:", err);
      setSnackbar({
        open: true,
        message: "Booking failed. Please try again.",
        severity: "error",
      });
    }
  };
  return (
    <>
      <ContentHeading
        heading="Ticket Management"
        showSubHeading={true}
        breadcrumbs="Add Ticket"
        showBreadcrumbs={true}
      />
      <div className={styles.addTicketGrid}>
        <div className={styles.addTicketLeft}>
          <div className={styles.addTicketContainer}>
            <InputField
              label="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              label="Mobile Number"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <InputField
              label="E-mail ID"
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
      <CustomBtn label="Proceed" onClick={handleProceed} />
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleCloseSnackbar}
      />
    </>
  );
};

export default AddTicket;
