import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../../services/axiosInstance";
import { setBusData } from "../../../../../redux/slices/busSlice";
import ContentHeading from "../../../../Reusable/Content-Heading/ContentHeading";
import CustomBtn from "../../../../Reusable/Custom-Button/CustomBtn";
import ProgressBar from "../../Progress-Bar/ProgressBar";
import styles from "./step-one-summary.module.css";
import { resetBusData } from "../../../../../redux/slices/busSlice";

const StepOneSummary = ({ step, busId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const busData = useSelector((state) => state.bus?.formData) || {};
  const [busImages, setBusImages] = useState([]);
  useEffect(() => {
    if (!busId) {
      console.warn("🚨 No busId found, skipping API call.");
      return;
    }

    const fetchBusData = async () => {
      try {
        // Fetch bus data
        const response = await axiosInstance.get(
          `/bus-operator/buses/${busId}`
        );

        // Fetch routes data
        const routesResponse = await axiosInstance.get(
          `/buses/bus-routes/bus/${busId}`
        );

        // Dispatch to store bus data
        dispatch(
          setBusData({
            ...response.data.data.bus,
            images: response.data?.data?.images || [],
            routes: routesResponse.data?.data || [],
          })
        );

        // Fetch bus images
        const imagesResponse = await axiosInstance.get(
          `/buses/images/${busId}`
        );
        setBusImages(imagesResponse.data?.data?.images || []);
      } catch (error) {
        console.error("❌ Error fetching bus data:", error);
      }
    };

    fetchBusData();
  }, [busId, dispatch]);

  useEffect(() => {
    dispatch(resetBusData());
  }, [dispatch]);

  const licenseURL = useMemo(
    () => busData?.busLicenseFront?.url || null,
    [busData?.busLicenseFront]
  );

  const onNext = () => {
    navigate("/bus-management");
  };

  const dayAbbreviations = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  return (
    <div>
      <ContentHeading
        heading="Bus Management"
        belowHeadingComponent={<ProgressBar step={step} />}
        showSubHeading={false}
        showBreadcrumbs={true}
        breadcrumbs="Bus Details"
      />
      <div className={styles.stepOneSummary}>
        <div className={styles.busDetailsTop}>
          <h3>Bus Details</h3>
          <div className={styles.contentDetails}>
            <div className={styles.imageBusBlock}>
              {Array.isArray(busImages) && busImages.length > 0 ? (
                busImages.map((image, idx) => (
                  <div key={idx} className={styles.imageBlockContainer}>
                    <img src={image.url} alt={`Bus Image ${idx}`} />
                  </div>
                ))
              ) : (
                <p>🚫 No images uploaded</p>
              )}
            </div>

            <div className={styles.contentInfo}>
              <h3>
                <span>Bus Name: </span>
                {busData?.busName || "Not provided"}
              </h3>
              <h3>
                <span>Bus Model Number: </span>
                {busData?.busModelNumber || "N/A"}
              </h3>
            </div>
            <div className={styles.contentInfo}>
              <h3>
                <span>Bus Registration Number: </span>
                {busData?.busRegNumber || "N/A"}
              </h3>
            </div>
          </div>
        </div>

        <div className={styles.busDetailsTop}>
          <div className={styles.amenityBlockContainer}>
            <div className={styles.contentBlock}>
              <h3>Amenities</h3>
              {Array.isArray(busData?.amenities) && busData.amenities.length ? (
                <div className={styles.amenityList}>
                  {busData.amenities.map((amenity, idx) => (
                    <div key={idx} className={styles.amenityItem}>
                      <h3>{amenity?.name || "Unknown Amenity"}</h3>{" "}
                      {/* Ensure `name` exists */}
                    </div>
                  ))}
                </div>
              ) : (
                <h3>🚫 No amenities selected</h3>
              )}
            </div>

            <div className={styles.contentBlock}>
              <h3>Days</h3>
              <h3 id={styles.daysClr}>
                {/* {busData?.runningDays?.length
                  ? busData.runningDays.map((day) => day.charAt(0)).join(" ")
                  : "Not selected"} */}
                {busData?.runningDays?.length
                  ? busData.runningDays
                      .map((day) => dayAbbreviations[day] || day)
                      .join(" ")
                  : "Not selected"}
              </h3>
            </div>
            <div className={styles.contentBlock}>
              <h3>License</h3>
              <h3>
                <span>Bus License: </span>
                {licenseURL ? (
                  <a
                    className={styles.licenseUrl}
                    href={licenseURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "🚫 No file uploaded"
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className={styles.busDetailsTop}>
          <h3>Routes: </h3>
          <div className={styles.routeBlock}>
            {busData?.routes?.length ? (
              busData.routes.map((route, idx) => (
                <div key={idx} className={styles.routeItem}>
                  <div className={`${styles.itemBlock} ${styles.item}`}>
                    <h3>Departure</h3>
                    <h3>{route.startLocation}</h3>
                    <h3 className={styles.clrTxt}>{route.departureTime}</h3>
                  </div>
                  <span className={styles.borderLine}></span>
                  <div className={styles.item}>
                    <h3>Price</h3>
                    <h3 className={styles.clrTxt}>
                      ${route.pricePerSeat || "0"}
                    </h3>
                  </div>
                  <span className={styles.borderLine}></span>
                  <div className={`${styles.itemBlock} ${styles.item}`}>
                    <h3>Arrival</h3>
                    <h3>{route.endLocation}</h3>
                    <h3 className={styles.clrTxt}>{route.arrivalTime}</h3>
                  </div>
                </div>
              ))
            ) : (
              <h3>🚫 No routes added</h3>
            )}
          </div>
        </div>
      </div>
      <div className={styles.customNext}>
        <CustomBtn onClick={onNext} label="Next" width="160px" />
      </div>
    </div>
  );
};

export default StepOneSummary;
