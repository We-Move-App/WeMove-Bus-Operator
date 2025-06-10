import React, { useEffect, useState } from "react";
import images from "../../../../../../assets/image";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";
import styles from "./pickup-drop-locations.module.css";
import DeleteIcon from "@mui/icons-material/Delete";

const PickupDropLocations = ({ routeId, stoppages, setStoppages }) => {
  useEffect(() => {
    if (!stoppages[routeId]) {
      setStoppages((prev) => ({
        ...prev,
        [routeId]: {
          pickup: [{ id: 1, name: "", time: "" }],
          drop: [{ id: 1, name: "", time: "" }],
        },
      }));
    }
  }, [routeId]);

  const pickupPoints = stoppages[routeId]?.pickup || [];
  const dropPoints = stoppages[routeId]?.drop || [];

  const updateStoppages = (updatedPickup, updatedDrop) => {
    onChange(routeId, {
      pickup: updatedPickup.map(({ city, time }) => ({
        name: city,
        time,
      })),
      drop: updatedDrop.map(({ city, time }) => ({
        name: city,
        time,
      })),
    });
  };

  const handleAddStop = (type) => {
    const newStop = { id: Date.now(), name: "", time: "" };
    setStoppages((prev) => {
      const updated = [...prev[routeId][type], newStop];
      return {
        ...prev,
        [routeId]: { ...prev[routeId], [type]: updated },
      };
    });
  };

  const handleInputChange = (type, index, field, value) => {
    setStoppages((prev) => {
      const updated = prev[routeId][type].map((stop, i) =>
        i === index ? { ...stop, [field]: value } : stop
      );
      return {
        ...prev,
        [routeId]: { ...prev[routeId], [type]: updated },
      };
    });
  };

  const handleDeleteStop = (type, index) => {
    setStoppages((prev) => {
      const updated = prev[routeId][type].filter((_, i) => i !== index);
      return {
        ...prev,
        [routeId]: { ...prev[routeId], [type]: updated },
      };
    });
  };

  const renderStops = (stops, type, color) =>
    stops.map((stop, index) => (
      <div key={stop.id} className={styles.stoppageBlock}>
        <div className={styles.stoppageHeader}>
          <button
            className={styles.deleteButton}
            onClick={() => handleDeleteStop(type, index)}
            title="Delete Stop"
          >
            <DeleteIcon style={{ color: "red" }} />
          </button>
        </div>
        <div className={styles.routeFlexContainer}>
          <div className={styles.routeFrom}>
            <div className={styles.routeImgBlock}>
              <img src={images.routeImg} alt="" />
            </div>
            <div className={styles.content}>
              <input
                className={
                  type === "pickup" ? styles.pickupTitle : styles.dropTitle
                }
                type="text"
                placeholder="Enter City"
                value={stop.name}
                onChange={(e) =>
                  handleInputChange(type, index, "name", e.target.value)
                }
              />
            </div>
          </div>
          <span className={styles.line}></span>
          <div className={styles.routeTime}>
            <div className={styles.routeImgBlock}>
              <RxCounterClockwiseClock size={24} />
            </div>
            <div className={styles.contentBlock}>
              <h4 className={styles.time}>Time</h4>
              <div className={styles.timePicker}>
                <input
                  className={styles.clock}
                  type="time"
                  value={stop.time}
                  onChange={(e) =>
                    handleInputChange(type, index, "time", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className={styles.pickupDropContent}>
      <h3>Route</h3>
      <div className={styles.routeContainer}>
        {/* Pickup Points */}
        <div className={styles.pickUpBlock}>
          <h4>Pick Up Points</h4>
          <div className={styles.routesStoppage}>
            <div className={styles.stoppageContainer}>
              {renderStops(pickupPoints, "pickup", "#2D6A4F")}
              <button
                className={styles.addStopButton}
                style={{
                  color: "#2D6A4F",
                  border: "1px solid #2D6A4F",
                }}
                onClick={() => handleAddStop("pickup")}
              >
                <FaPlus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Drop Points */}
        <div className={styles.pickUpBlock}>
          <h4>Drop Points</h4>
          <div className={styles.routesStoppage}>
            <div className={styles.stoppageContainer}>
              {renderStops(dropPoints, "drop", "#FDB637")}
              <button
                className={styles.addStopButton}
                style={{
                  color: "#FDB637",
                  border: "1px solid #FDB637",
                }}
                onClick={() => handleAddStop("drop")}
              >
                <FaPlus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupDropLocations;
