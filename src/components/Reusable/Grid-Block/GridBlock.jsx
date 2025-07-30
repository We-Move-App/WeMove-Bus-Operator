import React from "react";
import styles from "./grid-block.module.css";
import CustomBtn from "../Custom-Button/CustomBtn";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../services/axiosInstance";
import { setBusData, setStep } from "../../../redux/slices/busSlice";
import DriverList from "../Driver-Dropdown-List/DriverList";

const GridBlock = ({ _id, image, busName, modelNumber, regNumber, driver }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleViewDetails = async () => {
    if (!_id) {
      console.error("❌ Missing _id in GridBlock");
      return;
    }

    try {
      const response = await axiosInstance.get(`/buses/bus-routes/bus/${_id}`);

      console.log("✅ Bus Route Fetched:", response.data);

      dispatch(
        setBusData({
          _id,
          busImages: [{ url: image }],
          busName,
          busModelNumber: modelNumber,
          busRegNumber: regNumber,
          assignedDriver: driver,
          routes: response.data?.data ? [response.data.data] : [],
        })
      );

      dispatch(setStep(3));
      navigate("/bus-management/add-bus-details");
    } catch (error) {
      console.error("❌ Error fetching bus routes:", error);
    }
  };

  return (
    <div className={styles.gridBlock}>
      <div className={styles.gridContent}>
        <div className={styles.busImageContainer}>
          <img src={image} alt={busName} className={styles.busImage} />
        </div>
        <div className={styles.busDetails}>
          <h4>
            Bus Name : <span className={styles.title}>{busName}</span>
          </h4>
          <h4>
            Bus Model Number :{" "}
            <span className={styles.title}>{modelNumber}</span>
          </h4>
          <h4>
            Bus Registration Number :{" "}
            <span className={styles.title}>{regNumber}</span>
          </h4>
          <h4>
            Assigned Driver : <span className={styles.title}>{driver}</span>
          </h4>
          {/* <DriverList
            contacts={[
              { id: 1, name: "Alice", mobile: "9876543210" },
              { id: 2, name: "Bob", mobile: "9123456789" },
            ]}
            onSelect={(c) => console.log("Selected:", c)}
          /> */}
          <div className={styles.gridBtnBlock}>
            <CustomBtn
              label="View Details"
              onClick={handleViewDetails}
              className={styles.viewButton}
              width="152px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridBlock;
