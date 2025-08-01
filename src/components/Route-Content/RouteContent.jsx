import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Search from "../Reusable/Search-Box/Search";
import DataTable from "../Reusable/Table/DataTable";
import styles from "./route-content.module.css";
import axiosInstance from "../../services/axiosInstance";
import { setBusData } from "../../redux/slices/busSlice";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import { Skeleton } from "@mui/material";

const columns = [
  { key: "busRegNumber", title: "Bus Reg Number" },
  { key: "assignedDriver", title: "Assigned Driver" },
  { key: "startLocation", title: "Departure" },
  { key: "departureTime", title: "Time" },
  { key: "pickups", title: "Pick Ups" },
  { key: "endLocation", title: "Arrival" },
  { key: "arrivalTime", title: "Time" },
  { key: "drops", title: "Drops" },
  { key: "status", title: "Status" },
];

const RouteContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const busData = useSelector((state) => state.bus?.formData) || {};
  // console.log("Redux State in RouteContent:", busData);
  const busId = useSelector((state) => state.bus?.formData?._id);
  // console.log("Bus Id:", busId);
  const [routeData, setRouteData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return "N/A";

    // If already includes AM/PM, return as-is
    if (
      timeStr.toLowerCase().includes("am") ||
      timeStr.toLowerCase().includes("pm")
    ) {
      return timeStr;
    }

    if (!timeStr.includes(":")) return "N/A";

    const [hourStr, minute] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);

    if (isNaN(hour) || isNaN(parseInt(minute, 10))) return "N/A";

    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minute} ${period}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("🔄 Fetching bus data...");
        const busResponse = await axiosInstance.get(
          `/buses/bus-routes/all-routes`
        );
        // console.log("✅ Bus Data Fetched:", busResponse.data);
        const routes = busResponse.data?.data?.routes || [];
        console.log("Route ID:", busResponse.data?.data?.routes[0]?._id);

        // Dispatch routes to Redux store
        dispatch(setBusData({ routes }));

        // Format Data for Table
        const formattedData = routes.map((route) => ({
          busRegNumber: route.busRegNumber || "N/A",
          startLocation: route.startLocation || "N/A",
          departureTime: formatTime(route.departureTime) || "N/A",
          pickups: route.pickups?.map((p) => ({ name: p.name })) || [],
          endLocation: route.endLocation || "N/A",
          arrivalTime: formatTime(route.arrivalTime) || "N/A",
          drops: route.drops?.map((d) => ({ name: d.name })) || [],
          status: {
            routeId: route._id,
            value: route.status || "inactive",
          },
          pricePerSeat: route.pricePerSeat || "N/A",
          runningDays: route.runningDays?.join(", ") || "N/A",
          assignedDriver:
            Array.isArray(route.busId?.assignedDriver) &&
            route.busId.assignedDriver.length > 0
              ? route.busId.assignedDriver
                  .map((driver) => driver.fullName)
                  .join(", ")
              : "Not Assigned",
        }));

        setRouteData(formattedData);
        // console.log("✅ Formatted Data:", formattedData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [busId, dispatch]);

  return (
    <>
      <ContentHeading
        heading="Route Management"
        belowHeadingComponent={<Search />}
        showSubHeading={true}
        subHeading="Route Details"
        showBreadcrumbs={false}
      />

      <div className={styles.routeContentBlock}>
        {/* {routeData.length === 0 ? (
          <div className={styles.noDataMessage}>No route data available</div>
        ) : (
          <DataTable columns={columns} data={routeData} rowsPerPage={5} />
        )} */}
        {loading ? (
          <>
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={40}
                animation="wave"
                sx={{ borderRadius: 2, mb: 1 }}
              />
            ))}
          </>
        ) : routeData.length === 0 ? (
          <div className={styles.noDataMessage}>No route data available</div>
        ) : (
          <DataTable columns={columns} data={routeData} rowsPerPage={5} />
        )}
      </div>
    </>
  );
};

export default RouteContent;
