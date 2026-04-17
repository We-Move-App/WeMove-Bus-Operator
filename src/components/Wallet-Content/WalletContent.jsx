import React, { useEffect, useState } from "react";
import styles from "./wallet-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import CardDetails from "../Dashboard-Content/Card-Details/CardDetails";
import FinanceTable from "./Finance-Table/FinanceTable";
import axiosInstance from "../../services/axiosInstance";
import { useTranslation } from "react-i18next";

const WalletContent = () => {
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
    <div className="common-dashboard">
      <ContentHeading heading={t("wallet.heading")} showSubHeading={false} />

      <CardDetails
        walletDetails={walletDetails}
        showIncomeCard={false}
        hideMidContent={false}
      />

      <FinanceTable onWithdrawSuccess={fetchWallet} />
    </div>
  );
};

export default WalletContent;
