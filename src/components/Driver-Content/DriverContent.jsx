import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./driver-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import Search from "../Reusable/Search-Box/Search";
import CustomBtn from "../Reusable/Custom-Button/CustomBtn";
import DataTable from "../Reusable/Table/DataTable";
import axiosInstance from "../../services/axiosInstance";
import { Skeleton } from "@mui/material";

const columns = [
  { key: "DriverId", title: "Driver ID" },
  { key: "driverName", title: "Name" },
  { key: "regNumber", title: "Bus Reg Number" },
  { key: "mobNumber", title: "Mobile Number" },
  { key: "license", title: "License" },
  { key: "action", title: "Action" },
];

const DriverContent = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "" });
  const handleSearch = (params) => {
    setFilters((prev) => ({ ...prev, ...params }));
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/buses/drivers", {
          params: {
            ...filters,
          },
        });

        const result = response.data;

        if (result.success) {
          const formattedData = result.data.busDrivers.map((driver, index) => ({
            DriverId: {
              image: driver.avatar?.url || "https://via.placeholder.com/50",
              id: driver.busDriverId,
            },
            driverName: driver.fullName,
            regNumber: driver.assignedBus?.busRegNumber || "N/A",
            mobNumber: driver.phoneNumber,
            license: driver.driverLicenseFront?.url || "",
            action: {
              driverId: driver._id,
            },
          }));

          setDrivers(formattedData);
        } else {
          console.error("Error fetching drivers:", result.message);
          setDrivers([]);
        }
      } catch (error) {
        console.error("❌ Error fetching driver data:", error);
        setDrivers([]);
      }
      setLoading(false);
    };

    fetchDrivers();
  }, [filters]);

  return (
    <div>
      <ContentHeading
        heading="Driver Management"
        belowHeadingComponent={
          <Search
            paramKey="search"
            onSearch={handleSearch}
            placeholder="Search Driver ID"
          />
        }
        showSubHeading={true}
        subHeading="Driver Details"
        showBreadcrumbs={false}
        rightComponent={
          <CustomBtn
            onClick={() => navigate("/driver-management/add-driver-details")}
            label="Add New Driver"
            className={styles.addBusBtn}
            showIcon={true}
            width="264px"
          />
        }
      />
      <div className={styles.routeContentBlock}>
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
        ) : drivers.length === 0 ? (
          <div className={styles.noDataMessage}>No drivers data available</div>
        ) : (
          <DataTable columns={columns} data={drivers} rowsPerPage={5} />
        )}
      </div>
    </div>
  );
};

export default DriverContent;
