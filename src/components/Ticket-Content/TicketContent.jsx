import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ticket-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import CustomBtn from "../Reusable/Custom-Button/CustomBtn";
import { RiShareBoxFill } from "react-icons/ri";
import { CiFilter } from "react-icons/ci";
import Search from "../Reusable/Search-Box/Search";
import DataTable from "../Reusable/Table/DataTable";
import { FaRegCalendarAlt } from "react-icons/fa";
import DropdownMenu from "../Reusable/Drop-Down-Menu/DropdownMenu";
import FormModal from "../Reusable/Form-Modal/FormModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import axiosInstance from "../../services/axiosInstance";
import { Skeleton } from "@mui/material";
import { fi } from "date-fns/locale";

const columns = [
  // { key: "_id", title: "Booking ID" },
  { key: "bookingId", title: "Booking ID" },
  { key: "name", title: "Name" },
  { key: "busRegNumber", title: "Bus Reg Number" },
  { key: "contactNumber", title: "Mobile Number" },
  { key: "email", title: "Email ID" },
  { key: "journeyDate", title: "Date" },
  { key: "journeyTime", title: "Time" },
  { key: "from", title: "Pick Up" },
  { key: "to", title: "Drop" },
  { key: "getStatus", title: "Status" },
  // { key: "driverAction", title: "Action", className: styles.driverAction },
];

const getStatus = (status) => {
  if (status === "Departure") {
    return (
      <>
        <div className={styles.rowStatus}>
          <span className={styles.blinkingDot}></span> Departure
        </div>
      </>
    );
  } else if (status === "Yet to start") {
    return (
      <>
        <div className={styles.yetStatus}>
          <span className={styles.staticDot}></span> Yet to start
        </div>
      </>
    );
  }
  return status;
};

const data = [
  {
    _id: "ID_6790",
    name: "John Doe",
    busRegNumber: "DU1234-5678",
    contactNumber: "0987-6543",
    email: "john@example.com",
    journeyDate: "6.02.2025",
    journeyTime: "07:30 AM",
    from: "Metro Station",
    to: "City Mall",
    getStatus: getStatus("Yet to start"),
    driverAction: (
      <DropdownMenu
        Icon={BsThreeDotsVertical}
        options={[
          { label: "Edit", onClick: () => console.log("Edit Ticket") },
          { label: "Cancel", onClick: () => console.log("Cancel Ticket") },
        ]}
      />
    ),
  },
];

const TicketContent = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "" });

  const handleSearch = (params) => {
    setFilters((prev) => ({ ...prev, ...params }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/bus-operator/bookings", {
        params: {
          ...filters,
        },
      });
      const bookings = response.data.data.bookings;

      const transformedData = bookings.flatMap((booking) =>
        booking.passengers.map((passenger) => {
          const customer = booking.bookedByOperator || booking.bookedBy || {};

          return {
            // _id: passenger?._id
            //   ? `ID_${passenger._id.slice(-4).toUpperCase()}`
            //   : customer?._id
            //   ? `ID_${customer._id.slice(-4).toUpperCase()}`
            //   : "ID_UNKNOWN",
            _id: booking._id, // keep the actual booking id for searching
            bookingId: booking.bookingId, // pretty display ID
            name: passenger.name || customer.fullName || "-",
            busRegNumber: booking.busId?.busRegNumber || "-",
            contactNumber:
              passenger.contactNumber || customer.phoneNumber || "-",
            email: passenger?.email || customer.email || "-",
            journeyDate: new Date(booking.journeyDate).toLocaleDateString(
              "en-GB"
            ),
            journeyTime: new Date(booking.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            from: booking.from || "-",
            to: booking.to || "-",
            getStatus: getStatus(booking.status),
            driverAction: (
              <DropdownMenu
                Icon={BsThreeDotsVertical}
                options={[
                  { label: "Edit", onClick: () => console.log("Edit Ticket") },
                  {
                    label: "Cancel",
                    onClick: () => console.log("Cancel Ticket"),
                  },
                ]}
              />
            ),
          };
        })
      );

      setTicketData(transformedData);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  return (
    <>
      <ContentHeading
        heading="Ticket Management"
        belowHeadingComponent={
          <CustomBtn
            label="Export"
            showIcon={true}
            width="163px"
            className={styles.ticketBtn}
            icon={RiShareBoxFill}
            iconSize={24}
          />
        }
        showSubHeading={true}
        subHeading="Customer Details"
        showBreadcrumbs={false}
        rightComponent={
          <div className={styles.btnContainer}>
            <Search
              paramKey="search"
              onSearch={handleSearch}
              placeholder="Search Customer ID"
            />
            <CustomBtn
              label="Filter"
              showIcon={true}
              width="166px"
              className={styles.filterBtn}
              icon={CiFilter}
              iconSize={20}
              onClick={handleOpenModal}
            />
            <CustomBtn
              onClick={() => navigate("/ticket-management/add-ticket")}
              label="Add Ticket"
              showIcon={true}
              width="189px"
            />
          </div>
        }
      />
      {/* {ticketData.length === 0 ? (
        <div className={styles.noDataMessage}>No tickets data available</div>
      ) : (
        <DataTable
          columns={columns}
          data={ticketData}
          rowsPerPage={5}
          loading={loading}
        />
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
      ) : ticketData.length === 0 ? (
        <div className={styles.noDataMessage}>No tickets data available</div>
      ) : (
        <DataTable
          columns={columns}
          data={ticketData}
          rowsPerPage={5}
          loading={loading}
        />
      )}
      {/* Filter Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        showClose={false}
        content={
          <div className={styles.ticketFilterModal}>
            <div className={styles.filterHeading}>
              <p>Select Date</p>
            </div>
            <div className={styles.filterGridContainer}>
              <div className={styles.datePicker}>
                <FaRegCalendarAlt />
                <p>From Start Date</p>
              </div>
              <div className={styles.datePicker}>
                <FaRegCalendarAlt />
                <p>From End Date</p>
              </div>
              <div className={styles.datePicker}>
                <FaRegCalendarAlt />
                <p>From Pick Up Point</p>
              </div>
              <div className={styles.datePicker}>
                <FaRegCalendarAlt />
                <p>From Drop Point</p>
              </div>
            </div>
            <div className={styles.applyFilterBtn}>
              <CustomBtn label="Apply Filter" onClick={handleCloseModal} />
            </div>
          </div>
        }
      />
    </>
  );
};

export default TicketContent;
