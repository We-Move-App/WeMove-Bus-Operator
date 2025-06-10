import React, { useState } from "react";
import styles from "./expanded-route-details.module.css";
import images from "../../../../../assets/image";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";

const ExpandedRouteDetails = ({ route }) => {
  if (!route) return null;

  const [stoppages, setStoppages] = useState({
    [route.id]: { pickup: [], drop: [] },
  });

  const addStoppage = (type) => {
    setStoppages((prev) => {
      const newStoppages = prev[route.id] || { pickup: [], drop: [] };
      return {
        ...prev,
        [route.id]: {
          ...newStoppages,
          [type]: [
            ...newStoppages[type],
            {
              id: newStoppages[type].length + 1,
              city: "",
              time: "",
              period: "AM",
            },
          ],
        },
      };
    });
  };

  const updateStoppage = (type, index, field, value) => {
    setStoppages((prev) => {
      const newStoppages = prev[route.id] || { pickup: [], drop: [] };
      const updatedStoppages = [...newStoppages[type]];
      updatedStoppages[index][field] = value;

      return {
        ...prev,
        [route.id]: {
          ...newStoppages,
          [type]: updatedStoppages,
        },
      };
    });
  };

  const renderStoppages = (type) => (
    <div className={styles.pickUpBlock}>
      <h4>{type === "pickup" ? "Pick Up" : "Drop"} Points</h4>
      <div className={styles.routesStoppage}>
        <div className={styles.stoppageContainer}>
          {(stoppages[route.id]?.[type] || []).map((stop, index) => (
            <div key={stop.id} className={styles.stoppageBlock}>
              {index > 0 && (
                <div className={styles.middleImage}>
                  <span></span>
                  <div className={styles.routeImgBlock}>
                    <img src={images.routeImg} alt="Route" />
                  </div>
                  <span></span>
                </div>
              )}

              <div className={styles.routeFlexContainer}>
                <div className={styles.routeFrom}>
                  <div className={styles.routeImgBlock}>
                    <img src={images.routeImg} alt="" />
                  </div>
                  <div className={styles.content}>
                    <input
                      className={
                        type === "pickup"
                          ? styles.pickupTitle
                          : styles.dropTitle
                      }
                      type="text"
                      placeholder="Enter City"
                      value={stop.city}
                      onChange={(e) =>
                        updateStoppage(type, index, "city", e.target.value)
                      }
                    />
                  </div>
                </div>
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
                          updateStoppage(type, index, "time", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            className={styles.addStopButton}
            style={{
              color: type === "pickup" ? "#2D6A4F" : "#FDB637",
              border: `1px solid ${type === "pickup" ? "#2D6A4F" : "#FDB637"}`,
            }}
            onClick={() => addStoppage(type)}
          >
            <FaPlus size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.expandedContent}>
      <h3>Route</h3>
      <div className={styles.routeContainer}>
        {renderStoppages("pickup")}
        {renderStoppages("drop")}
      </div>
    </div>
  );
};

export default ExpandedRouteDetails;
