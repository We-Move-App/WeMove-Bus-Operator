import React from "react";
import styles from "./bus-days.module.css";

const BusDays = ({ formData, setFormData }) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const toggleDay = (day) => {
    const updatedDays = formData.runningDays.includes(day)
      ? formData.runningDays.filter((d) => d !== day)
      : [...formData.runningDays, day];

    setFormData({ ...formData, runningDays: updatedDays });
  };

  return (
    <div className={styles.busDaysContainer}>
      <div className={styles.content}>
        <h3>Days</h3>
      </div>
      <div className={styles.daysContainer}>
        {days.map((day) => (
          <button
            key={day}
            className={`${styles.dayButton} ${
              formData.runningDays.includes(day) ? styles.selected : ""
            }`}
            onClick={() => toggleDay(day)}
          >
            <h3>{day}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusDays;
