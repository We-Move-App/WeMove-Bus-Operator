import React from "react";
import styles from "./wallet-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import CardDetails from "../Dashboard-Content/Card-Details/CardDetails";
import FinanceTable from "./Finance-Table/FinanceTable";
import { useTranslation } from "react-i18next";

const WalletContent = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="common-dashboard">
        <ContentHeading heading={t("wallet.heading")} showSubHeading={false} />
        <CardDetails showIncomeCard={false} hideMidContent={false} />
        <FinanceTable />
      </div>
    </>
  );
};

export default WalletContent;
