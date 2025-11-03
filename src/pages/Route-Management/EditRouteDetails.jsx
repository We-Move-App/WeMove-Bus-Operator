import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import styles from "./edit-route.module.css";
import ContentHeading from "../../components/Reusable/Content-Heading/ContentHeading";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Popper } from "@mui/material";
import dayjs from "dayjs";
import { Clock } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import EditPickupModal from "../../components/Edit-Pickup-Modal/EditPickupModal";
import { useNavigate } from "react-router-dom";
import SnackbarNotification from "../../components/Reusable/Snackbar-Notification/SnackbarNotification";

const EditRouteDetails = () => {
  const { id } = useParams();
  console.log("Editing route with ID:", id);

  const [formData, setFormData] = useState({
    busId: "",
    busRegistrationNumber: "DU0978-7898",
    departure: "Hola Road",
    departureTime: "06.00 AM",
    pricePerSeat: "",
    arrival: "Cameroon",
    arrivalTime: "06.00 AM",
  });

  const [departureTimeOpen, setDepartureTimeOpen] = useState(false);
  const [departureAnchorEl, setDepartureAnchorEl] = useState(null);

  const [arrivalTimeOpen, setArrivalTimeOpen] = useState(false);
  const [arrivalAnchorEl, setArrivalAnchorEl] = useState(null);

  const [pickupPoints, setPickupPoints] = useState([]);
  const [dropPoints, setDropPoints] = useState([]);
  const [editingPickupId, setEditingPickupId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (type, id) => {
    setEditingType(type);

    let point;
    if (type === "pickup") {
      point = pickupPoints.find((p) => p._id === id);
    } else if (type === "drop") {
      point = dropPoints.find((p) => p._id === id);
    }

    if (point) {
      setSelectedPickup({ ...point });
      setShowModal(true);
    }
  };

  const handlePickupFieldChange = (field, value) => {
    setSelectedPickup((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveModal = () => {
    if (editingType === "pickup") {
      setPickupPoints((prev) =>
        prev.map((p) => (p._id === selectedPickup._id ? selectedPickup : p))
      );
    } else if (editingType === "drop") {
      setDropPoints((prev) =>
        prev.map((d) => (d._id === selectedPickup._id ? selectedPickup : d))
      );
    }
    setShowModal(false);
    setEditingType(null);
  };

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await axiosInstance.get(`/buses/bus-routes/${id}`);
        const data = response.data.data;

        setFormData({
          busRegistrationNumber: data.busRegNumber || "",
          busId: data.busId || "",
          departure: data.startLocation || "",
          departureTime: data.departureTime || "",
          pricePerSeat: data.pricePerSeat || "",
          arrival: data.endLocation || "",
          arrivalTime: data.arrivalTime || "",
        });

        setPickupPoints(data.pickups || []);
        setDropPoints(data.drops || []);
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, [id]);

  // const handleSaveDetails = async () => {
  //   try {
  //     const payload = {
  //       busId: formData.busId,
  //       busRegNumber: formData.busRegistrationNumber,
  //       startLocation: formData.departure,
  //       departureTime: formData.departureTime,
  //       endLocation: formData.arrival,
  //       arrivalTime: formData.arrivalTime,
  //       pickups: pickupPoints,
  //       drops: dropPoints,
  //     };

  //     const response = await axiosInstance.put(
  //       `/buses/bus-routes/edit/${id}`,
  //       payload
  //     );
  //     console.log("✅ Route updated successfully:", response.data);
  //     // Optionally show a success toast or redirect
  //   } catch (error) {
  //     console.error("❌ Failed to update route:", error);
  //     // Optionally show an error toast
  //   }
  // };

  const handleSaveDetails = async () => {
    try {
      // 1️⃣ Update route details
      const routePayload = {
        busId: formData.busId,
        busRegNumber: formData.busRegistrationNumber,
        startLocation: formData.departure,
        departureTime: formData.departureTime,
        endLocation: formData.arrival,
        arrivalTime: formData.arrivalTime,
        pickups: pickupPoints,
        drops: dropPoints,
      };

      const routeResponse = await axiosInstance.put(
        `/buses/bus-routes/edit/${id}`,
        routePayload
      );
      console.log("Route updated successfully:", routeResponse.data);

      // 2️⃣ Update price per seat
      const pricePayload = {
        routeId: id,
        pricePerSeat: Number(formData.pricePerSeat),
      };

      const priceResponse = await axiosInstance.post(
        `/buses/bus-routes/update-price`,
        pricePayload
      );
      console.log("Price updated successfully:", priceResponse.data);

      setSnackbar({
        open: true,
        message: "Route and price updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/route-management");
      }, 1500);
    } catch (error) {
      console.error("❌ Failed to update route or price:", error);
      setSnackbar({
        open: true,
        message: "Failed to update route or price.",
        severity: "error",
      });
    }
  };

  return (
    <div className={styles.routeManagementContainer}>
      <ContentHeading
        heading="Route Management"
        showSubHeading={false}
        showBreadcrumbs={true}
        breadcrumbs="Edit Route"
      />

      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <div className={styles.formSection}>
            <h3 className={styles.formLabel}>Departure</h3>
            <input
              type="text"
              name="departure"
              value={formData.departure}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.formSection}>
              <label className={styles.formLabel}>Departure Time</label>
              <div
                className={styles.inputWithIcon}
                onClick={(e) => {
                  setDepartureAnchorEl(e.currentTarget);
                  setDepartureTimeOpen(true);
                }}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="text"
                  name="departureTime"
                  value={formData.departureTime}
                  readOnly
                  className={`${styles.formInput} ${styles.timeInput}`}
                  placeholder="06:00 AM"
                />
                <div className={styles.timeIcon}>
                  <Clock size={20} />
                </div>
              </div>

              <TimePicker
                open={departureTimeOpen}
                onClose={() => setDepartureTimeOpen(false)}
                value={
                  formData.departureTime
                    ? dayjs(formData.departureTime, "hh:mm A")
                    : null
                }
                onChange={(newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    departureTime: newValue ? newValue.format("hh:mm A") : "",
                  }));
                  setDepartureTimeOpen(false);
                }}
                slotProps={{
                  textField: {
                    sx: { display: "none" },
                  },
                  popper: {
                    anchorEl: departureAnchorEl,
                  },
                }}
              />
            </div>
          </LocalizationProvider>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formSection}>
            <h3 className={styles.formLabel}>Arrival</h3>
            <input
              type="text"
              name="arrival"
              value={formData.arrival}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.formSection}>
              <label className={styles.formLabel}>Arrival Time</label>
              <div
                className={styles.inputWithIcon}
                onClick={(e) => {
                  setArrivalAnchorEl(e.currentTarget);
                  setArrivalTimeOpen(true);
                }}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="text"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  readOnly
                  className={`${styles.formInput} ${styles.timeInput}`}
                  placeholder="06:00 AM"
                />
                <div className={styles.timeIcon}>
                  <Clock size={20} />
                </div>
              </div>

              <TimePicker
                open={arrivalTimeOpen}
                onClose={() => setArrivalTimeOpen(false)}
                value={
                  formData.arrivalTime
                    ? dayjs(formData.arrivalTime, "hh:mm A")
                    : null
                }
                onChange={(newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    arrivalTime: newValue ? newValue.format("hh:mm A") : "",
                  }));
                  setArrivalTimeOpen(false);
                }}
                slotProps={{
                  textField: {
                    sx: { display: "none" },
                  },
                  popper: {
                    anchorEl: arrivalAnchorEl,
                  },
                }}
              />
            </div>
          </LocalizationProvider>
        </div>

        <div className={styles.pointsRow}>
          <div className={styles.pointsSection}>
            <div className={styles.pointsHeader}>
              <h3>Pickup Points</h3>
              {/* <button className={styles.addButton} onClick={handleAddPickup}>
                <Plus size={16} />
                Add Pickup
              </button> */}
            </div>
            <div className={styles.pointsList}>
              {pickupPoints.map((point) => (
                <div key={point._id} className={styles.pointItem}>
                  <span className={styles.pointName}>
                    {point.name} ({point.time})
                  </span>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit("pickup", point._id)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pointsSection}>
            <div className={styles.pointsHeader}>
              <h3>Drop Points</h3>
              {/* <button className={styles.addButton} onClick={handleAddDropOff}>
                <Plus size={16} />
                Add DropOff
              </button> */}
            </div>
            <div className={styles.pointsList}>
              {dropPoints.map((point) => (
                <div key={point._id} className={styles.pointItem}>
                  <span className={styles.pointName}>
                    {point.name} ({point.time})
                  </span>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit("drop", point._id)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.formSection}>
            <h3 className={styles.formLabel}>Price</h3>
            <input
              type="text"
              name="pricePerSeat"
              // value={formData.arrival}
              value={formData.pricePerSeat}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>
        </div>

        <EditPickupModal
          isOpen={showModal}
          point={selectedPickup}
          onChange={handlePickupFieldChange}
          onClose={() => setShowModal(false)}
          onSave={handleSaveModal}
        />

        <div className={styles.saveSection}>
          <button className={styles.saveButton} onClick={handleSaveDetails}>
            Save
          </button>
        </div>

        <SnackbarNotification
          snackbar={snackbar}
          handleClose={handleCloseSnackbar}
        />
      </div>
    </div>
  );
};

export default EditRouteDetails;
