import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./data-table.module.css";
import Pagination from "../Pagination/Pagination";
import FormModal from "../Form-Modal/FormModal";
import StatusToggle from "../Toggle-Button/StatusToggle";
import DropdownMenu from "../Drop-Down-Menu/DropdownMenu";

const DataTable = ({ columns, data, rowsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLicense, setSelectedLicense] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (licenseUrl) => {
    if (!licenseUrl) return;

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(licenseUrl);

    if (isImage) {
      setSelectedLicense(licenseUrl);
      setModalOpen(true);
    } else {
      window.open(licenseUrl, "_blank");
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className || ""}>
                    {col.key === "license" ? (
                      row[col.key] ? (
                        <button
                          className={styles.viewButton}
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenModal(row[col.key]);
                          }}
                        >
                          View
                        </button>
                      ) : (
                        "N/A"
                      )
                    ) : col.key === "pickups" || col.key === "drops" ? (
                      Array.isArray(row[col.key]) ? (
                        <DropdownMenu
                          options={row[col.key].map((item) => ({
                            label: item.name,
                            onClick: () =>
                              console.log(`Selected: ${item.name}`),
                          }))}
                        />
                      ) : (
                        row[col.key] || "N/A"
                      )
                    ) : col.key === "status" ? (
                      <StatusToggle
                        initialStatus={row[col.key]}
                        onStatusChange={(newStatus) =>
                          console.log(
                            `Status changed for ${row.busRegNumber}:`,
                            newStatus
                          )
                        }
                      />
                    ) : col.key === "DriverId" &&
                      typeof row[col.key] === "object" ? (
                      <div className={styles.driverIdContainer}>
                        <div className={styles.driverImageBlock}>
                          <img
                            src={row[col.key].image}
                            alt="Driver"
                            className={styles.driverImage}
                          />
                        </div>
                        <span>{row[col.key].id}</span>
                      </div>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for License Image */}
        <FormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          content={
            <img
              src={selectedLicense}
              alt="Driver License"
              className={styles.licenseImage}
            />
          }
        />
      </div>
      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default DataTable;
