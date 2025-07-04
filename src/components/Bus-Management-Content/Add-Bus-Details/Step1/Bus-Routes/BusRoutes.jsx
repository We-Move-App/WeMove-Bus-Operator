import React from "react";
import styles from "./bus-routes.module.css";
import { LiaDollarSignSolid } from "react-icons/lia";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Bus } from "lucide-react";
import { RxCounterClockwiseClock } from "react-icons/rx";
import PickupDropLocations from "./Pickup-Drop-Locations/PickupDropLocations";

const BusRoutes = ({ busId, routes, setRoutes, stoppages, setStoppages }) => {
  // console.log("Bus ID in BusRoutes:", busId);
  const handleInputChange = (index, field, value) => {
    if (field === "price") {
      value = value ? parseFloat(value) : null;
    }

    const updatedRoutes = routes.map((route, i) =>
      i === index ? { ...route, [field]: value } : route
    );

    setRoutes(updatedRoutes);
  };

  return (
    <div className={styles.mainRouteContainer}>
      {routes.map((route, index) => (
        <div key={index} className={styles.busRoutesContainer}>
          {/* Departure */}
          <div className={styles.routes}>
            <div className={styles.scheduleRow}>
              <div className={styles.scheduleHeader}>
                <h3>Departure</h3>
              </div>
            </div>
            <div className={styles.timeSection}>
              <div className={styles.timeInput}>
                <RxCounterClockwiseClock size={30} />
                <div className={styles.timeInputBox}>
                  <span>TIME</span>
                  <div className={styles.timeSelectedBox}>
                    <input
                      type="time"
                      value={route.departureTime}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "departureTime",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <span className={styles.line}></span>
              <div className={styles.locationInput}>
                <span className={styles.locationIcon}>
                  <Bus size={30} />
                </span>
                <div className={styles.timeInputBox}>
                  <span>FROM</span>
                  <input
                    type="text"
                    value={route.from}
                    onChange={(e) =>
                      handleInputChange(index, "from", e.target.value)
                    }
                  />
                </div>
                <div className={styles.arrow}>
                  <IoIosArrowRoundForward size={30} />
                </div>
              </div>
            </div>
          </div>

          {/* Arrival */}
          <div className={styles.routes}>
            <div className={styles.scheduleRow}>
              <div className={styles.scheduleHeader}>
                <h3>Arrival</h3>
              </div>
            </div>
            <div className={`${styles.timeSection} ${styles.timeRowBg}`}>
              <div className={styles.locationInput}>
                <span className={styles.locationIcon}>
                  <Bus size={30} />
                </span>
                <div className={styles.timeInputBox}>
                  <span>TO</span>
                  <input
                    type="text"
                    value={route.to}
                    onChange={(e) =>
                      handleInputChange(index, "to", e.target.value)
                    }
                  />
                </div>
              </div>
              <span className={styles.line}></span>
              <div className={styles.timeInput}>
                <RxCounterClockwiseClock size={30} />
                <div className={styles.timeInputBox}>
                  <span>TIME</span>
                  <div className={styles.timeSelectedBox}>
                    <input
                      type="time"
                      value={route.arrivalTime}
                      onChange={(e) =>
                        handleInputChange(index, "arrivalTime", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className={`${styles.scheduleRow} ${styles.priceRow}`}>
            <div className={styles.priceSection}>
              <span className={styles.line}></span>
              <span className={styles.priceIcon}>
                <LiaDollarSignSolid size={30} />
              </span>
              <div className={styles.timeInputBox}>
                <span>PRICE</span>
                <input
                  type="number"
                  value={route.price}
                  min="0"
                  onChange={(e) =>
                    handleInputChange(index, "price", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {routes.map((route, index) => (
        <div key={index} className={styles.busRoutesContainer}>
          <PickupDropLocations
            routeId={route.id}
            stoppages={stoppages}
            setStoppages={setStoppages}
          />
        </div>
      ))}
    </div>
  );
};

export default BusRoutes;
