import React, { useState, useEffect, useCallback } from "react";
import styles from "./transaction-table.module.css";
import axiosInstance from "../../../../services/axiosInstance";
import Pagination from "../../../Reusable/Pagination/Pagination";
import { useTranslation } from "react-i18next";

const TransactionTable = () => {
  const { t, i18n } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const transactionsPerPage = 10;

  const fetchTransactions = useCallback(
    async (page = 1) => {
      try {
        const res = await axiosInstance.get(
          `/wallet/transactions?entity=busoperator&page=${page}&limit=${transactionsPerPage}`,
        );

        const payload = res?.data?.data || {};
        const items = payload.data || payload.transactions || [];

        setTransactions(items);

        if (payload.pagination) {
          setTotalPages(payload.pagination.pages || 1);
          setTotalTransactions(payload.pagination.total || 0);
          setCurrentPage(payload.pagination.page || page);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    },
    [transactionsPerPage],
  );

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [fetchTransactions, currentPage]);

  return (
    <div className={styles.transactionContainer}>
      <div className={styles.mainHeading}>
        <h5>{t("transaction.heading")}</h5>
      </div>

      <div className={styles.transactionTableWrapper}>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>{t("transaction.columns.id")}</th>
              <th>{t("transaction.columns.type")}</th>
              <th>{t("transaction.columns.source")}</th>
              <th>{t("transaction.columns.date")}</th>
              <th>{t("transaction.columns.time")}</th>
              <th>{t("transaction.columns.amount")}</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx, idx) => {
              const createdAt = new Date(tx.createdAt);

              const formattedDate = createdAt.toLocaleDateString(i18n.language);

              const formattedTime = createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const sourceOrDescription = tx.withdraw
                ? t("transaction.walletWithdrawal")
                : tx.meta?.from?.name || tx.description || t("transaction.na");

              const amount = tx.amountPaid ?? tx.amount;

              return (
                <tr key={tx._id || idx}>
                  <td>{tx.transactionId}</td>
                  <td>{tx.transactionType}</td>
                  <td>{sourceOrDescription}</td>
                  <td>{formattedDate}</td>
                  <td>{formattedTime}</td>
                  <td>
                    {tx.type === "DEBIT" ? "-" : "+"}
                    {amount} {tx.currency}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default TransactionTable;
