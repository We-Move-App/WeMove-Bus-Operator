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

const BusContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "" });

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = (params) => {
    setFilters((prev) => ({ ...prev, ...params }));
    setCurrentPage(1); // reset to page 1 when searching
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
          heading="Bus Management"
          belowHeadingComponent={
            <Search
              paramKey="search"
              onSearch={handleSearch}
              placeholder="Search Buses"
            />
          }
          showSubHeading={true}
          subHeading="Bus Details"
          showBreadcrumbs={false}
          rightComponent={
            <CustomBtn
              onClick={() => {
                dispatch(resetBusData());
                navigate("/bus-management/add-bus-details");
              }}
              label="Add Bus Details"
              className={styles.addBusBtn}
              showIcon={true}
            />
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
        {/* Pagination can be added here in the future */}
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
