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
import { useTranslation } from "react-i18next";

const StepOneSummary = ({ step, busId }) => {
  const { t } = useTranslation();
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
          `/bus-operator/buses/${busId}`,
        );

        // Fetch routes data
        const routesResponse = await axiosInstance.get(
          `/buses/bus-routes/bus/${busId}`,
        );

        // Dispatch to store bus data
        dispatch(
          setBusData({
            ...response.data.data.bus,
            images: response.data?.data?.images || [],
            routes: routesResponse.data?.data || [],
          }),
        );

        // Fetch bus images
        const imagesResponse = await axiosInstance.get(
          `/buses/images/${busId}`,
        );
        setBusImages(imagesResponse.data?.data?.images || []);
      } catch (error) {
        console.error("❌ Error fetching bus data:", error);
      }
    };

    fetchBusData();
  }, [busId, dispatch]);

  const licenseURL = useMemo(
    () => busData?.busLicenseFront?.url || null,
    [busData?.busLicenseFront],
  );

  const onNext = () => {
    navigate("/bus-management");
    setTimeout(() => dispatch(resetBusData()), 100);
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
        heading={t("busSummary.heading")}
        belowHeadingComponent={<ProgressBar step={step} />}
        showSubHeading={false}
        showBreadcrumbs={true}
        breadcrumbs={t("busSummary.breadcrumbs")}
      />
      <div className={styles.stepOneSummary}>
        <div className={styles.busDetailsTop}>
          <h3>{t("busSummary.busDetails")}</h3>
          <div className={styles.contentDetails}>
            <div className={styles.imageBusBlock}>
              {Array.isArray(busImages) && busImages.length > 0 ? (
                busImages.map((image, idx) => (
                  <div key={idx} className={styles.imageBlockContainer}>
                    <img src={image.url} alt={`Bus Image ${idx}`} />
                  </div>
                ))
              ) : (
                <p>{t("busSummary.noImages")}</p>
              )}
            </div>

            <div className={styles.contentInfo}>
              <h3>
                <span>{t("busSummary.busName")}: </span>
                {busData?.busName || t("busSummary.notProvided")}
              </h3>
              <h3>
                <span>{t("busSummary.busModelNumber")}: </span>
                {busData?.busModelNumber || t("busSummary.na")}
              </h3>
            </div>
            <div className={styles.contentInfo}>
              <h3>
                <span>{t("busSummary.busRegistrationNumber")}: </span>
                {busData?.busRegNumber || t("busSummary.na")}
              </h3>
            </div>
          </div>
        </div>

        <div className={styles.busDetailsTop}>
          <div className={styles.amenityBlockContainer}>
            <div className={styles.contentBlock}>
              <h3>{t("busSummary.amenities")}</h3>
              {Array.isArray(busData?.amenities) && busData.amenities.length ? (
                <div className={styles.amenityList}>
                  {busData.amenities.map((amenity, idx) => (
                    <div key={idx} className={styles.amenityItem}>
                      <h3>{amenity?.name || t("busSummary.unknownAmenity")}</h3>{" "}
                      {/* Ensure `name` exists */}
                    </div>
                  ))}
                </div>
              ) : (
                <h3>{t("busSummary.noAmenities")}</h3>
              )}
            </div>

            <div className={styles.contentBlock}>
              <h3>{t("busSummary.days")}</h3>
              <h3 id={styles.daysClr}>
                {/* {busData?.runningDays?.length
                  ? busData.runningDays.map((day) => day.charAt(0)).join(" ")
                  : "Not selected"} */}
                {busData?.runningDays?.length
                  ? busData.runningDays
                      .map((day) => t(`busDaysShort.${day}`, day))
                      .join(" ")
                  : t("busSummary.notSelected")}
              </h3>
            </div>
            <div className={styles.contentBlock}>
              <h3>{t("busSummary.license")}</h3>
              <h3>
                <span>{t("busSummary.busLicense")}: </span>
                {licenseURL ? (
                  <a
                    className={styles.licenseUrl}
                    href={licenseURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("busSummary.view")}
                  </a>
                ) : (
                  <p>{t("busSummary.noFile")}</p>
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className={styles.busDetailsTop}>
          <h3>{t("busSummary.routes")}</h3>
          <div className={styles.routeBlock}>
            {busData?.routes?.length ? (
              busData.routes.map((route, idx) => (
                <div key={idx} className={styles.routeItem}>
                  <div className={`${styles.itemBlock} ${styles.item}`}>
                    <h3>{t("busSummary.departure")}</h3>
                    <h3>{route.startLocation}</h3>
                    <h3 className={styles.clrTxt}>{route.departureTime}</h3>
                  </div>
                  <span className={styles.borderLine}></span>
                  <div className={styles.item}>
                    <h3>{t("busSummary.price")}</h3>
                    <h3 className={styles.clrTxt}>
                      ${route.pricePerSeat || "0"}
                    </h3>
                  </div>
                  <span className={styles.borderLine}></span>
                  <div className={`${styles.itemBlock} ${styles.item}`}>
                    <h3>{t("busSummary.arrival")}</h3>
                    <h3>{route.endLocation}</h3>
                    <h3 className={styles.clrTxt}>{route.arrivalTime}</h3>
                  </div>
                </div>
              ))
            ) : (
              <h3>{t("busSummary.noRoutes")}</h3>
            )}
          </div>
        </div>
      </div>
      <div className={styles.customNext}>
        <CustomBtn
          onClick={onNext}
          label={t("busSummary.next")}
          width="160px"
        />
      </div>
    </div>
  );
};

export default StepOneSummary;
