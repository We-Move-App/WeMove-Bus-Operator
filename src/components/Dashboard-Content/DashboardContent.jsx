import React from "react";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import CardDetails from "./Card-Details/CardDetails";
import CustomBarChart from "./Custom-Bar-Chart/CustomBarChart";
import CustomPieChart from "./Custom-Pie-Chart/CustomPieChart";
import styles from "./dashboard-content.module.css";

const DashboardContent = () => {
  return (
    <>
      {/* <DashboardLayout> */}
      <ContentHeading
        heading="Dashboard"
        subHeading="Reports"
        showSubHeading={true}
      />
      <div className={styles.dashboardTwoHalves}>
        <div className={styles.leftContent}>
          <CardDetails showIncomeCard={true} hideMidContent={false} />
          <CustomBarChart />
        </div>
        <div className={styles.rightContent}>
          <CustomPieChart />
        </div>
      </div>

      {/* </DashboardLayout> */}
    </>
  );
};

export default DashboardContent;
