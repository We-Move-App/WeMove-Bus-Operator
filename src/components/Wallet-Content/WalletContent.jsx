import React from "react";
import styles from "./wallet-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import CardDetails from "../Dashboard-Content/Card-Details/CardDetails";
import FinanceTable from "./Finance-Table/FinanceTable";

const WalletContent = () => {
  return (
    <>
      <div className="common-dashboard">
        <ContentHeading heading="Wallet" showSubHeading={false} />
        <CardDetails showIncomeCard={false} hideMidContent={false} />
        <FinanceTable />
      </div>
    </>
  );
};

export default WalletContent;
