import React, { useState, useEffect, useCallback } from "react";
import styles from "./transaction-table.module.css";
import images from "../../../../assets/image";
import axiosInstance from "../../../../services/axiosInstance";
import Pagination from "../../../Reusable/Pagination/Pagination";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const transactionsPerPage = 10;

  const fetchTransactions = useCallback(
    async (page = 1) => {
      try {
        const res = await axiosInstance.get(
          `/wallet/transactions?entity=busoperator&page=${page}&limit=${transactionsPerPage}`
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
    [transactionsPerPage]
  );

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [fetchTransactions, currentPage]);

  return (
    <div className={styles.transactionContainer}>
      <div className={styles.mainHeading}>
        <h5>Transaction History</h5>

        {/* <div className={styles.searchFilterContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="search"
              placeholder="Search"
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>
              <span className={styles.line}></span>
              <img src={images.searchIcon} alt="search-icon" />
            </div>
          </div>
        </div> */}
      </div>

      <div className={styles.transactionTableWrapper}>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Transaction Type</th>
              <th>Source / Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => {
              const createdAt = new Date(tx.createdAt);

              const formattedDate = createdAt.toLocaleDateString();
              const formattedTime = createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              // Source / Description column
              const sourceOrDescription = tx.withdraw
                ? "Wallet Withdrawal"
                : tx.meta?.from?.name || tx.description || "N/A";

              // Amount (prefer amountPaid when available)
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

      {/* YOUR PAGINATION COMPONENT HERE */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default TransactionTable;
