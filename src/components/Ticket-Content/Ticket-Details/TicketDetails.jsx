import React, { useEffect, useState, useMemo } from "react";
import styles from "./ticket-details.module.css";
import { BsClock } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoBusOutline } from "react-icons/io5";
import axiosInstance from "../../../services/axiosInstance";

const TicketDetails = ({ onRouteSelect, routesOverride = null, filters }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (Array.isArray(routesOverride)) {
      setRoutes(routesOverride);
      setLoading(false);
      return;
    }

    const fetchRoutes = async () => {
      try {
        const res = await axiosInstance.get("/buses/bus-routes/all-routes");
        const fetchedRoutes = res.data.data.routes;
        if (fetchedRoutes && fetchedRoutes.length > 0) {
          setRoutes(fetchedRoutes);
        } else {
          setError("No bus routes available.");
        }
      } catch (err) {
        console.error("Failed to fetch routes:", err);
        setError("Unable to load routes. Please make sure you're logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [routesOverride]);

  const parseTime = (timeStr) => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;

    const hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

    return hour * 60 + minute;
  };

  const calculateDuration = (start, end, isNextDay = false) => {
    const startTotal = parseTime(start);
    const endTotal = parseTime(end);

    if (startTotal === null || endTotal === null) return "Invalid time";

    let adjustedEnd = endTotal;
    if (isNextDay || endTotal <= startTotal) {
      adjustedEnd += 24 * 60;
    }

    const durationMinutes = adjustedEnd - startTotal;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axiosInstance.get("/buses/bus-routes/all-routes");
        const fetchedRoutes = res.data.data.routes;

        if (fetchedRoutes && fetchedRoutes.length > 0) {
          setRoutes(fetchedRoutes);
        } else {
          setError("No bus routes available.");
        }
      } catch (err) {
        console.error("Failed to fetch routes:", err);
        setError("Unable to load routes. Please make sure you're logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const filteredRoutes = useMemo(() => {
    if (!filters) return routes; 

    const { from, to, date } = filters;

    return routes.filter((route) => {
      const matchFrom = from
        ? route.startLocation.toLowerCase().includes(from.toLowerCase())
        : true;

      const matchTo = to
        ? route.endLocation.toLowerCase().includes(to.toLowerCase())
        : true;

      const matchDate = date ? true : true;

      return matchFrom && matchTo && matchDate;
    });
  }, [routes, filters]);

  if (loading) return <p className={styles.loading}>Loading bus routes...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.ticketFilterContainer}>
      <div className={styles.busDetailsContainer}>
        {/* No matching routes */}
        {filteredRoutes.length === 0 && (
          <p style={{ padding: "1rem", color: "#666" }}>
            No routes found for this search.
          </p>
        )}

        {filteredRoutes.map((route) => {
          const isSelected = selectedRoute?._id === route._id;
          return (
            <div
              className={`${styles.busDetailsCard} ${
                isSelected ? styles.selectedCard : ""
              }`}
              onClick={() => {
                setSelectedRoute(route);
                onRouteSelect(route);
              }}
              key={route._id}
            >
              <div className={styles.busDetailsLeft}>
                <div className={styles.busDetailsTitle}>Bus Details</div>
                <div className={styles.busDetailsName}>
                  {route?.busId?.busName || "NA"}
                </div>
                <div className={styles.busDetailsType}>
                  {route.startLocation} → {route.endLocation}
                </div>
              </div>

              <div className={styles.busDetailsMiddle}>
                <div className={styles.daysIndicator}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => {
                    const fullDay = [
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ][i];

                    const isActive = route.runningDays.includes(fullDay);

                    return (
                      <span
                        key={i}
                        style={{ color: isActive ? "#000" : "#aaa" }}
                      >
                        {d}
                      </span>
                    );
                  })}
                </div>

                <div className={styles.busDetailSeparator}></div>

                <div className={styles.busDetailsTime}>
                  <div className={styles.departureTime}>
                    {route.departureTime}
                  </div>
                  <div className={styles.timeSeparator}></div>
                  <div className={styles.arrivalTime}>{route.arrivalTime}</div>
                  <div className={styles.lineTime}></div>
                  <div className={styles.journeyDuration}>
                    {calculateDuration(route.departureTime, route.arrivalTime)}
                  </div>
                </div>
              </div>

              <div className={styles.busDetailsRight}>
                <div className={styles.amountLabel}>Amount</div>
                <div className={styles.amountValue}>
                  ${route.pricePerSeat ?? "0.00"}
                </div>
                <div className={styles.priceLabel}>Price</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketDetails;
