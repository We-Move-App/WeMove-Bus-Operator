import React from "react";
import styles from "./edit-pickup-modal.module.css";
import { Clock, MapPin } from "lucide-react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EditPickupModal = ({ isOpen, onClose, point, onChange, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Edit Pickup Point</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <label className={styles.label}>
            <MapPin size={16} className={styles.icon} />
            Location
          </label>
          <input
            type="text"
            value={point.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={styles.input}
          />

          <label className={styles.label}>
            <Clock size={16} className={styles.icon} />
            Time
          </label>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              value={dayjs(point.time, "HH:mm")}
              onChange={(value) =>
                onChange("time", value ? value.format("HH:mm") : "")
              }
              slotProps={{
                textField: {
                  className: styles.input,
                  InputProps: {
                    sx: {
                      height: 38,
                    },
                  },
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={onSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPickupModal;
