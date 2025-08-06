import React, { useState, useEffect } from "react";
import styles from "./transaction-table.module.css";
import images from "../../../../assets/image";
import axiosInstance from "../../../../services/axiosInstance";

const transactions = [
  {
    id: "OL678057",
    user: "Davi Malhotra",
    date: "11-03-2024",
    time: "10:30 AM",
    amount: "1000",
    balance: "34,567",
  },
  {
    id: "OL678057",
    user: "Jane Smith",
    date: "21-03-2024",
    time: "11:00 AM",
    amount: "2000",
    balance: "24,567",
  },
  {
    id: "OL678057",
    user: "Bob Williams",
    date: "22-03-2024",
    time: "02:15 PM",
    amount: "3000",
    balance: "20,567",
  },
  {
    id: "OL678057",
    user: "Davi Malhotra",
    date: "22-03-2024",
    time: "03:45 PM",
    amount: "4000",
    balance: "21,567",
  },
  {
    id: "OL678057",
    user: "David Miller",
    date: "23-03-2024",
    time: "09:30 AM",
    amount: "5000",
    balance: "22,567",
  },
  {
    id: "OL678057",
    user: "Charlie Johnson",
    date: "24-03-2024",
    time: "11:45 AM",
    amount: "6000",
    balance: "20,567",
  },
];

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     const token = localStorage.getItem("dashboardAccessToken");
  //     if (!token) {
  //       console.error("Access token not found in localStorage");
  //       return;
  //     }

  //     try {
  //       const res = await axios.get(
  //         "http://139.59.20.155:8001/api/v1/wallet/transactions?entity=busoperator",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setTransactions(res.data.data.transactions); // Adjust based on actual response
  //       console.log("Fetched transactions:", res.data.data.transactions);
  //     } catch (error) {
  //       console.error("Error fetching transactions:", error);
  //     }
  //   };

  //   fetchTransactions();
  // }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get(
          "/wallet/transactions?entity=busoperator"
        );
        console.log("Fetched transactions:", res.data?.data?.transactions);
        setTransactions(res.data?.data?.transactions || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // return (
  //   <div className={styles.transactionContainer}>
  //     <div className={styles.mainHeading}>
  //       <h5>Transaction History</h5>

  //       {/* Search Bar */}
  //       <div className={styles.searchFilterContainer}>
  //         <div className={styles.inputWrapper}>
  //           <input
  //             type="search"
  //             placeholder="Search"
  //             className={styles.searchInput}
  //           />
  //           <div className={styles.searchIcon}>
  //             <span className={styles.line}></span>
  //             <img src={images.searchIcon} alt="search-icon" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className={styles.transactionTableWrapper}>
  //       <table className={styles.transactionTable}>
  //         <thead>
  //           <tr>
  //             <th>Transaction ID</th>
  //             <th>User Name</th>
  //             <th>Date</th>
  //             <th>Time</th>
  //             <th>Amount</th>
  //             {/* <th>Available Balance</th> */}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {currentTransactions.map((transaction, index) => (
  //             <tr key={`${transaction.id}-${index}`}>
  //               <td>{transaction.id}</td>
  //               <td>{transaction.user}</td>
  //               <td>{transaction.date}</td>
  //               <td>{transaction.time}</td>
  //               <td>{transaction.amount}</td>
  //               {/* <td>{transaction.balance}</td> */}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>

  //     <div className={styles.pagination}>
  //       <button
  //         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  //         disabled={currentPage === 1}
  //         className={styles.paginationButton}
  //       >
  //         Prev
  //       </button>
  //       <span className={styles.paginationInfo}>
  //         Page {currentPage} of {totalPages}
  //       </span>
  //       <button
  //         onClick={() =>
  //           setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  //         }
  //         disabled={currentPage === totalPages}
  //         className={styles.paginationButton}
  //       >
  //         Next
  //       </button>
  //     </div>
  //   </div>
  // );

  return (
    <div className={styles.transactionContainer}>
      <div className={styles.mainHeading}>
        <h5>Transaction History</h5>

        <div className={styles.searchFilterContainer}>
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
        </div>
      </div>

      <div className={styles.transactionTableWrapper}>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              {/* <th>Available Balance</th> */}
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction, index) => {
              const dateTime = new Date(transaction.createdAt); // assuming API includes `createdAt`
              const formattedDate = dateTime.toLocaleDateString();
              const formattedTime = dateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={`${transaction._id}-${index}`}>
                  {/* <td>{transaction.transactionId || transaction._id}</td> */}
                  <td>{`OL${(index + 1).toString().padStart(6, "0")}`}</td>
                  <td>{transaction.userName || "N/A"}</td>
                  <td>{formattedDate}</td>
                  <td>{formattedTime}</td>
                  <td>
                    {transaction.amount} {transaction.currency}
                  </td>
                  {/* <td>{transaction.balance}</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Prev
        </button>
        <span className={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
