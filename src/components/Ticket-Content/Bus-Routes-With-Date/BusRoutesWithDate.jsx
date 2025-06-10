import React, { useEffect } from "react";
import styles from "./bus-routes-date.module.css";
import { IoIosSearch } from "react-icons/io";
import { PiCalendarDotsLight } from "react-icons/pi";
import { GiBus } from "react-icons/gi";
import TicketDetails from "../Ticket-Details/TicketDetails";

const BusRoutesWithDate = ({ formData, setFormData, onRouteSelect }) => {
  useEffect(() => {
    if (formData.routes.length === 0) {
      setFormData({
        ...formData,
        routes: [
          {
            date: new Date().toISOString().split("T")[0],
            from: "Enter City",
            to: "Enter City",
          },
        ],
      });
    }
  }, [formData, setFormData]);

  const schedules = formData.routes || [];

  const handleInputChange = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setFormData({ ...formData, routes: updatedSchedules });
  };

  return (
    <div className={styles.mainRouteContainer}>
      {schedules.map((schedule, index) => (
        <div key={index} className={styles.busRoutesContainer}>
          {/* Departure Section - Date & From Together */}
          <div className={styles.routes}>
            <div className={styles.scheduleRow}>
              <div className={styles.scheduleHeader}>
                <h3>Departure</h3>
              </div>
            </div>
            <div className={styles.timeSection}>
              <div className={styles.timeContainerBox}>
                <PiCalendarDotsLight size={32} color="white" />
                <div className={styles.timeInputBox}>
                  <h3>Date</h3>
                  <input
                    type="date"
                    value={schedule.date}
                    onChange={(e) =>
                      handleInputChange(index, "date", e.target.value)
                    }
                  />
                </div>
              </div>
              <span className={styles.line}></span>
              <div className={styles.timeContainerBox}>
                <GiBus size={32} color="white" />
                <div className={styles.timeInputBox}>
                  <h3>From</h3>
                  <input
                    type="text"
                    value={schedule.from}
                    onChange={(e) =>
                      handleInputChange(index, "from", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Arrival Section - "To" is Separate */}
          <div className={styles.routes}>
            <div className={styles.scheduleRow}>
              <div className={styles.scheduleHeader}>
                <h3>Arrival</h3>
              </div>
            </div>
            <div className={styles.timeSectionBox}>
              <div className={styles.timeSearchBox}>
                <GiBus size={32} color="white" />
                <div className={styles.timeInputBox}>
                  <h3>To</h3>
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      value={schedule.to}
                      onChange={(e) =>
                        handleInputChange(index, "to", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.searchInputBox}>
                <div className={styles.searchBox}>
                  <IoIosSearch size={20} className={styles.searchIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <TicketDetails onRouteSelect={onRouteSelect} />
    </div>
  );
};

export default BusRoutesWithDate;
