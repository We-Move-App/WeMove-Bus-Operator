import React, { useState } from "react";
import styles from "./bus-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import Search from "../Reusable/Search-Box/Search";
import CustomBtn from "../Reusable/Custom-Button/CustomBtn";
import BusGrid from "../Bus-Grid/BusGrid";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetBusData } from "../../redux/slices/busSlice";
import Pagination from "../Reusable/Pagination/Pagination";
import { useTranslation } from "react-i18next";

const BusContent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));

  const role = userData?.role;

  const [filters, setFilters] = useState({ search: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = (params) => {
    setFilters((prev) => ({ ...prev, ...params }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.busContentContainer}>
      <div className={styles.busContentBlock}>
        <ContentHeading
          heading={t("busManagement.title")}
          subHeading={t("busManagement.subTitle")}
          showSubHeading={true}
          showBreadcrumbs={false}
          belowHeadingComponent={
            <Search
              paramKey="search"
              onSearch={handleSearch}
              placeholder={t("busManagement.searchPlaceholder")}
            />
          }
          rightComponent={
            role !== "bus-operator-member" ? (
              <CustomBtn
                onClick={() => {
                  dispatch(resetBusData());
                  navigate("/bus-management/add-bus-details");
                }}
                label={t("busManagement.addBus")}
                className={styles.addBusBtn}
                showIcon={true}
              />
            ) : null
          }
        />
      </div>

      <div className={styles.gridBlockContainer}>
        <BusGrid
          filters={filters}
          currentPage={currentPage}
          setTotalPages={setTotalPages}
        />
      </div>

      <div className={styles.paginationContainer}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
export default BusContent;
