import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ticket-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import CustomBtn from "../Reusable/Custom-Button/CustomBtn";
import Search from "../Reusable/Search-Box/Search";
import DataTable from "../Reusable/Table/DataTable";
import DropdownMenu from "../Reusable/Drop-Down-Menu/DropdownMenu";
import FormModal from "../Reusable/Form-Modal/FormModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import axiosInstance from "../../services/axiosInstance";
import { Skeleton } from "@mui/material";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const TicketContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "" });
  const [filterValues, setFilterValues] = useState({
    pickup: "",
    drop: "",
  });

  const handleSearch = (params) => {
    setFilters((prev) => ({ ...prev, ...params }));
  };

  const getStatus = (status) => {
    if (status === "Departure") {
      return (
        <div className={styles.rowStatus}>
          <span className={styles.blinkingDot}></span>
          {t("ticket.status.departure")}
        </div>
      );
    } else if (status === "Yet to start") {
      return (
        <div className={styles.yetStatus}>
          <span className={styles.staticDot}></span>
          {t("ticket.status.yetToStart")}
        </div>
      );
    }
    return status;
  };

  const columns = [
    { key: "bookingId", title: t("ticket.columns.bookingId") },
    { key: "name", title: t("ticket.columns.name") },
    { key: "busRegNumber", title: t("ticket.columns.busRegNumber") },
    { key: "contactNumber", title: t("ticket.columns.mobile") },
    { key: "email", title: t("ticket.columns.email") },
    { key: "journeyDate", title: t("ticket.columns.date") },
    { key: "journeyTime", title: t("ticket.columns.time") },
    { key: "from", title: t("ticket.columns.pickup") },
    { key: "to", title: t("ticket.columns.drop") },
    { key: "getStatus", title: t("ticket.columns.status") },
  ];

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/bus-operator/bookings", {
        params: { ...filters },
      });

      const bookings = response.data.data.bookings;

      const transformedData = bookings.flatMap((booking) =>
        booking.passengers.map((passenger) => {
          const customer = booking.bookedByOperator || booking.bookedBy || {};

          return {
            _id: booking._id,
            bookingId: booking.bookingId,
            name: passenger.name || customer.fullName || "-",
            busRegNumber: booking.busId?.busRegNumber || "-",
            contactNumber:
              passenger.contactNumber || customer.phoneNumber || "-",
            email: passenger?.email || customer.email || "-",
            journeyDate: new Date(booking.journeyDate).toLocaleDateString(
              "en-GB",
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
                  {
                    label: t("ticket.actions.edit"),
                    onClick: () => console.log("Edit Ticket"),
                  },
                  {
                    label: t("ticket.actions.cancel"),
                    onClick: () => console.log("Cancel Ticket"),
                  },
                ]}
              />
            ),
          };
        }),
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
  }, [filters, t]);

  return (
    <>
      <ContentHeading
        heading={t("ticket.heading")}
        showSubHeading={true}
        subHeading={t("ticket.subHeading")}
        showBreadcrumbs={false}
        rightComponent={
          <div className={styles.btnContainer}>
            <Search
              paramKey="search"
              onSearch={handleSearch}
              placeholder={t("ticket.search")}
            />

            <CustomBtn
              onClick={() => navigate("/ticket-management/add-ticket")}
              label={t("ticket.addTicket")}
              showIcon={true}
              width="189px"
            />
          </div>
        }
      />

      {loading ? (
        [...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={40}
            animation="wave"
            sx={{ borderRadius: 2, mb: 1 }}
          />
        ))
      ) : ticketData.length === 0 ? (
        <div className={styles.noDataMessage}>{t("ticket.noData")}</div>
      ) : (
        <DataTable columns={columns} data={ticketData} rowsPerPage={5} />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showClose={true}
        content={
          <div className={styles.ticketFilterModal}>
            <div className={styles.filterHeading}>
              <p>{t("ticket.filters.heading")}</p>
            </div>

            <div className={styles.filterGridContainer}>
              <div className={styles.datePicker}>
                <FaRegCalendarAlt />
                <input
                  type="text"
                  placeholder={t("ticket.filters.pickup")}
                  value={filterValues.pickup}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      pickup: e.target.value,
                    }))
                  }
                />
              </div>

              <div className={styles.datePicker}>
                <FaRegCalendarAlt />
                <input
                  type="text"
                  placeholder={t("ticket.filters.drop")}
                  value={filterValues.drop}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      drop: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className={styles.applyFilterBtn}>
              <CustomBtn
                label={t("ticket.filters.apply")}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, ...filterValues }));
                  setIsModalOpen(false);
                }}
              />
            </div>
          </div>
        }
      />
    </>
  );
};

export default TicketContent;
