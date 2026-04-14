import React, { useState, useEffect } from "react";
import styles from "./bus-routes-date.module.css";
import { IoIosSearch } from "react-icons/io";
import { PiCalendarDotsLight } from "react-icons/pi";
import { GiBus } from "react-icons/gi";
import TicketDetails from "../Ticket-Details/TicketDetails";
import axiosInstance from "../../../services/axiosInstance";
import { useTranslation } from "react-i18next";

const BusRoutesWithDate = ({ formData, setFormData, onRouteSelect }) => {
  const { t } = useTranslation();

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
      setSearchError(t("addTicket.busRoutes.validation"));
      return;
    }

    setSearchError("");
    setSearching(true);

    try {
      const res = await axiosInstance.get("buses/bus-routes/all-routes", {
        params: payload,
      });

      const filtered = res.data?.data?.routes ?? [];
      setSearchedRoutes(filtered);
    } catch (err) {
      console.error("Search API failed:", err);
      setSearchError(t("addTicket.busRoutes.error"));
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
          {/* Departure */}
          <div className={styles.routes}>
            <div className={styles.scheduleRow}>
              <div className={styles.scheduleHeader}>
                <h3>{t("addTicket.busRoutes.departure")}</h3>
              </div>
            </div>

            <div className={styles.timeSection}>
              <div className={styles.timeContainerBox}>
                <PiCalendarDotsLight size={32} color="white" />
                <div className={styles.timeInputBox}>
                  <h3>{t("addTicket.busRoutes.date")}</h3>
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
                  <h3>{t("addTicket.busRoutes.from")}</h3>
                  <input
                    type="text"
                    value={schedule.from}
                    placeholder={t("addTicket.busRoutes.enterCity")}
                    onChange={(e) =>
                      handleInputChange(index, "from", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Arrival */}
          <div className={styles.routes}>
            <div className={styles.scheduleRow}>
              <div className={styles.scheduleHeader}>
                <h3>{t("addTicket.busRoutes.arrival")}</h3>
              </div>
            </div>

            <div className={styles.timeSectionBox}>
              <div className={styles.timeSearchBox}>
                <GiBus size={32} color="white" />
                <div className={styles.timeInputBox}>
                  <h3>{t("addTicket.busRoutes.to")}</h3>
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      value={schedule.to}
                      placeholder={t("addTicket.busRoutes.enterCity")}
                      onChange={(e) =>
                        handleInputChange(index, "to", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

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

      {searchError && (
        <div style={{ color: "red", padding: "8px 0" }}>{searchError}</div>
      )}

      {searching && (
        <div style={{ padding: "8px 0" }}>
          {t("addTicket.busRoutes.searching")}
        </div>
      )}

      {searchedRoutes !== null && (
        <div style={{ margin: "8px 0" }}>
          <button onClick={clearSearch} className={styles.clearSearchBtn}>
            {t("addTicket.busRoutes.clearSearch")}
          </button>
        </div>
      )}

      <TicketDetails
        routesOverride={searchedRoutes}
        onRouteSelect={(selectedRoute) => {
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
