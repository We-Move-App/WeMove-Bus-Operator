import React, { useEffect, useState } from "react";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import CardDetails from "./Card-Details/CardDetails";
import CustomBarChart from "./Custom-Bar-Chart/CustomBarChart";
import CustomPieChart from "./Custom-Pie-Chart/CustomPieChart";
import styles from "./dashboard-content.module.css";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../services/axiosInstance";

const DashboardContent = () => {
  const { t } = useTranslation();
  const [walletDetails, setWalletDetails] = useState(null);
  const fetchWallet = async () => {
    try {
      const res = await axiosInstance.get("/wallet/details");
      setWalletDetails(res.data.data);
    } catch (err) {
      console.error("Wallet fetch failed", err);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <>
      {/* <DashboardLayout> */}
      <ContentHeading
        heading={t("dashboard.title")}
        subHeading={t("dashboard.subtitle")}
        showSubHeading={true}
      />
      <div className={styles.dashboardTwoHalves}>
        <div className={styles.leftContent}>
          <CardDetails
            walletDetails={walletDetails}
            showIncomeCard={true}
            hideMidContent={false}
          />
          {/* <CardDetails showIncomeCard={true} hideMidContent={false} /> */}
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
