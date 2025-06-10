import React from "react";
import styles from "./manage-routes.module.css";
import LayoutNew from "../../Layout-New/LayoutNew";
import ContentHeading from "../../Reusable/Content-Heading/ContentHeading";
import Search from "../../Reusable/Search-Box/Search";
import CustomBtn from "../../Reusable/Custom-Button/CustomBtn";
import RouteCard from "./Route-Card/RouteCard";

const ManageRoutes = () => {
  return (
    <>
      <LayoutNew>
        <ContentHeading
          heading="Route Management"
          showSubHeading={true}
          subHeading="Route Management"
          showBreadcrumbs={true}
          breadcrumbs="Manage Route"
        />
        <div className={styles.manageBusContainer}>
          <h3>Select Bus Registration Number</h3>
          <Search className={styles.customClass} />
        </div>

        <RouteCard />
      </LayoutNew>
    </>
  );
};

export default ManageRoutes;
