import React from "react";
import styles from "./bus-content.module.css";
import ContentHeading from "../Reusable/Content-Heading/ContentHeading";
import Search from "../Reusable/Search-Box/Search";
import CustomBtn from "../Reusable/Custom-Button/CustomBtn";
import BusGrid from "../Bus-Grid/BusGrid";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetBusData } from "../../redux/slices/busSlice";

const BusContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className={styles.busContentContainer}>
      <div className={styles.busContentBlock}>
        <ContentHeading
          heading="Bus Management"
          belowHeadingComponent={<Search />}
          showSubHeading={true}
          subHeading="Bus Details"
          showBreadcrumbs={false}
          rightComponent={
            <CustomBtn
              onClick={() => {
                dispatch(resetBusData());
                navigate("/bus-management/add-bus-details");
              }}
              label="Add Bus Details"
              className={styles.addBusBtn}
              showIcon={true}
            />
          }
        />
      </div>
      <div className={styles.gridBlockContainer}>
        <BusGrid />
      </div>
    </div>
  );
};

export default BusContent;
