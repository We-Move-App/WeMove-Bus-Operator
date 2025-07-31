import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./bus-management.module.css";
import axiosInstance from "../../services/axiosInstance";

const BusManagementForm = ({ formData, setFormData }) => {
  const [dropdownStates, setDropdownStates] = useState({
    busName: false,
    busModel: false,
  });

  const [busNameOptions, setBusNameOptions] = useState([]);
  const [busModelOptions, setBusModelOptions] = useState([]);
  const [allBuses, setAllBuses] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDropdown = (field) => {
    setDropdownStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const selectOption = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setDropdownStates((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await axiosInstance.get(
          "/bus-operator/buses/my-buses"
        );
        const result = response.data;

        if (result.success && result.data?.buses?.length > 0) {
          const buses = result.data.buses;
          setAllBuses(buses);
          const uniqueNames = [...new Set(buses.map((bus) => bus.busName))];
          const uniqueModels = [
            ...new Set(buses.map((bus) => bus.busModelNumber)),
          ];

          setBusNameOptions(uniqueNames);
          setBusModelOptions(uniqueModels);
          const firstBus = buses[0];
          setFormData({
            busName: firstBus.busName || "",
            busModel: firstBus.busModelNumber || "",
            busRegistrationNumber: firstBus.busRegNumber || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch bus data", error);
      }
    };

    fetchBusData();
  }, []);

  useEffect(() => {
    if (formData.busName && formData.busModel && allBuses.length > 0) {
      const matchedBus = allBuses.find(
        (bus) =>
          bus.busName === formData.busName &&
          bus.busModelNumber === formData.busModel
      );

      if (matchedBus) {
        setFormData((prev) => ({
          ...prev,
          busRegistrationNumber: matchedBus.busRegNumber,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          busRegistrationNumber: "",
        }));
      }
    }
  }, [formData.busName, formData.busModel, allBuses]);

  return (
    <div className={styles.busManagementContainer}>
      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <div className={styles.formSection}>
            <label className={styles.formLabel}>Bus Name</label>
            <div className={styles.dropdownContainer}>
              <div
                className={styles.dropdownField}
                onClick={() => toggleDropdown("busName")}
              >
                <span className={styles.dropdownValue}>
                  {formData.busName || "Select Bus Name"}
                </span>
                <ChevronDown
                  size={20}
                  className={`${styles.dropdownIcon} ${
                    dropdownStates.busName ? styles.rotated : ""
                  }`}
                />
              </div>
              {dropdownStates.busName && (
                <div className={styles.dropdownMenu}>
                  {busNameOptions.map((option) => (
                    <div
                      key={option}
                      className={styles.dropdownOption}
                      onClick={() => selectOption("busName", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <label className={styles.formLabel}>Bus Model</label>
            <div className={styles.dropdownContainer}>
              <div
                className={styles.dropdownField}
                onClick={() => toggleDropdown("busModel")}
              >
                <span className={styles.dropdownValue}>
                  {formData.busModel || "Select Bus Model"}
                </span>
                <ChevronDown
                  size={20}
                  className={`${styles.dropdownIcon} ${
                    dropdownStates.busModel ? styles.rotated : ""
                  }`}
                />
              </div>
              {dropdownStates.busModel && (
                <div className={styles.dropdownMenu}>
                  {busModelOptions.map((option) => (
                    <div
                      key={option}
                      className={styles.dropdownOption}
                      onClick={() => selectOption("busModel", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${styles.formSection} ${styles.registrationSection}`}>
          <label className={styles.formLabel}>Bus Registration Number</label>
          <input
            type="text"
            name="busRegistrationNumber"
            value={formData.busRegistrationNumber}
            onChange={handleInputChange}
            className={`${styles.formInput} ${styles.registrationInput}`}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default BusManagementForm;
