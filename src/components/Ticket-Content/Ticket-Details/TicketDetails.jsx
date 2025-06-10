import React, { useEffect, useState } from "react";
import styles from "./ticket-details.module.css";
import { BsClock } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoBusOutline } from "react-icons/io5";
import axiosInstance from "../../../services/axiosInstance";

const TicketDetails = ({ onRouteSelect }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const calculateDuration = (start, end) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let startTotal = startHour * 60 + startMinute;
    let endTotal = endHour * 60 + endMinute;

    // Handle overnight trips
    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    const durationMinutes = endTotal - startTotal;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  // useEffect(() => {
  //   const fetchRoutes = async () => {
  //     try {
  //       const res = await axiosInstance.get("/buses/bus-routes/all-routes");
  //       setRoutes(res.data.data.routes || []);
  //     } catch (err) {
  //       console.error("Failed to fetch routes:", err);
  //       setError("Unable to load routes. Please make sure you're logged in.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRoutes();
  // }, []);

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

  if (loading) return <p className={styles.loading}>Loading bus routes...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  // if (routes.length === 0)
  //   return <p className={styles.error}>No bus routes available.</p>;

  return (
    <div className={styles.ticketFilterContainer}>
      <div className={styles.ticketFilterItems}>
        <div className={styles.filterHeading}>
          <p>Filter By</p>
        </div>
        <div className={styles.filterBlock}>
          <div className={styles.ticketFilter}>
            <BsClock />
            <div className={styles.items}>
              Time <MdOutlineKeyboardArrowDown />
            </div>
          </div>
          <div className={styles.ticketFilter}>
            <LiaRupeeSignSolid />
            <div className={styles.items}>
              Price <MdOutlineKeyboardArrowDown />
            </div>
          </div>
          <div className={styles.ticketFilter}>
            <IoBusOutline />
            <div className={styles.items}>
              Type <MdOutlineKeyboardArrowDown />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.busDetailsContainer}>
        {routes.map((route) => {
          const isSelected = selectedRoute?._id === route._id;
          return (
            <div
              className={`${styles.busDetailsCard} ${
                isSelected ? styles.selectedCard : ""
              }`}
              onClick={() => {
                console.log("Selected Route ID:", route._id);
                console.log("Selected Bus ID:", route.busId?._id);
                setSelectedRoute(route);
                onRouteSelect(route);
              }}
              key={route._id}
            >
              <div className={styles.busDetailsLeft}>
                <div className={styles.busDetailsTitle}>Bus Details</div>
                <div className={styles.busDetailsName}>
                  {route?.busId.busName}
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
                  ${route.pricePerSeat.finalAmount}
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
