import React, { useState, useEffect } from "react";
import styles from "./bus-routes-date.module.css";
import { IoIosSearch } from "react-icons/io";
import { PiCalendarDotsLight } from "react-icons/pi";
import { GiBus } from "react-icons/gi";
import TicketDetails from "../Ticket-Details/TicketDetails";
import axiosInstance from "../../../services/axiosInstance";

const BusRoutesWithDate = ({ formData, setFormData, onRouteSelect }) => {
  useEffect(() => {
    if (!formData.routes || formData.routes.length === 0) {
      setFormData((prev) => ({
        ...prev,
        routes: [
          {
            date: new Date().toISOString().split("T")[0],
            from: "",
            to: "",
          },
        ],
      }));
    }
  }, []);

  const schedules = formData.routes || [];

  const handleInputChange = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };
    setFormData({ ...formData, routes: updatedSchedules });
  };

  const [searchedRoutes, setSearchedRoutes] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearchClick = async (index) => {
    const schedule = schedules[index] || {};
    const payload = {
      date: schedule.date || "",
      from: schedule.from || "",
      to: schedule.to || "",
    };

    if (!payload.from && !payload.to && !payload.date) {
      setSearchError("Please enter at least one filter (from / to / date).");
      return;
    }

    setSearchError("");
    setSearching(true);

    try {
      const res = await axiosInstance.get("buses/bus-routes/all-routes", {
        params: {
          from: payload.from,
          to: payload.to,
          date: payload.date,
        },
      });
      const filtered = res.data?.data?.routes ?? [];

      setSearchedRoutes(filtered);
    } catch (err) {
      console.error("Search API failed:", err);
      setSearchError("Failed to fetch filtered routes. Try again.");
      setSearchedRoutes([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchedRoutes(null);
    setSearchError("");
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
                    placeholder="Enter City"
                    onChange={(e) =>
                      handleInputChange(index, "from", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Arrival Section - "To" + Search */}
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
                      placeholder="Enter City"
                      onChange={(e) =>
                        handleInputChange(index, "to", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className={styles.searchInputBox}>
                <button
                  type="button"
                  className={styles.searchBox}
                  onClick={() => handleSearchClick(index)}
                >
                  <IoIosSearch size={30} className={styles.searchIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* show search error or loading */}
      {searchError && (
        <div style={{ color: "red", padding: "8px 0" }}>{searchError}</div>
      )}
      {searching && <div style={{ padding: "8px 0" }}>Searching...</div>}

      {/* CLEAR SEARCH BUTTON (visible only when a filtered result is shown) */}
      {searchedRoutes !== null && (
        <div style={{ margin: "8px 0" }}>
          <button onClick={clearSearch} className={styles.clearSearchBtn}>
            Clear search
          </button>
        </div>
      )}

      <TicketDetails
        routesOverride={searchedRoutes}
        onRouteSelect={(selectedRoute) => {
          console.log("selectedRoute at parent:", selectedRoute);
          const updatedSchedules = [...(formData.routes || [])];
          updatedSchedules[0] = {
            ...updatedSchedules[0],
            from: selectedRoute.startLocation,
            to: selectedRoute.endLocation,
          };

          setFormData({ ...formData, routes: updatedSchedules });

          if (onRouteSelect) onRouteSelect(selectedRoute);
        }}
      />
    </div>
  );
};

export default BusRoutesWithDate;
