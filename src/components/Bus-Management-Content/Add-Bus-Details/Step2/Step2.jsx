import React, { useState, useEffect, useRef } from "react";
import styles from "./step2.module.css";
import ContentHeading from "../../../Reusable/Content-Heading/ContentHeading";
import ProgressBar from "../Progress-Bar/ProgressBar";
import CustomBtn from "../../../Reusable/Custom-Button/CustomBtn";
import BusRoutes from "../Step1/Bus-Routes/BusRoutes";
import SnackbarNotification from "../../../Reusable/Snackbar-Notification/SnackbarNotification";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../../../hooks/useFetch";
import { setBusData } from "../../../../redux/slices/busSlice";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { useTranslation } from "react-i18next";

const Step2 = ({ onSubmit, onPrevious, step }) => {
  const topRef = useRef(null);
  const { fetchData } = useFetch();
  const dispatch = useDispatch();
  const [totalSeats, setTotalSeats] = useState("");
  const [stoppages, setStoppages] = useState({});
  const formData = useSelector((state) => state.bus.formData);
  const { t } = useTranslation();
  const [routes, setRoutes] = useState([
    {
      id: 1,
      from: "",
      to: "",
      departureTime: "00:00",
      arrivalTime: "00:00",
      price: 0,
    },
  ]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "error" });
  };

  useEffect(() => {
    const el = topRef.current;
    if (el) {
      el.scrollIntoView({ block: "start", behavior: "auto" });
      const header =
        document.querySelector("header") ||
        document.querySelector(".app-header");
      if (header && header.offsetHeight) {
        window.scrollBy(0, -header.offsetHeight);
      }
      window.scrollTo({
        top: Math.max(0, window.pageYOffset),
        behavior: "auto",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  const handleSave = async () => {
    try {
      if (totalSeats <= 0) {
        showSnackbar(t("busStep2.validation.invalidSeats"), "error");
        return;
      }
      for (const [i, route] of routes.entries()) {
        if (!route.from.trim()) {
          showSnackbar(
            t("busStep2.validation.fromRequired").replace("{{index}}", i + 1),
            "error",
          );
          return;
        }
        if (!route.to.trim()) {
          showSnackbar(
            t("busStep2.validation.toRequired").replace("{{index}}", i + 1),
            "error",
          );
          return;
        }
        if (!route.departureTime) {
          showSnackbar(
            t("busStep2.validation.departureRequired").replace(
              "{{index}}",
              i + 1,
            ),
            "error",
          );
          return;
        }
        if (!route.arrivalTime) {
          showSnackbar(
            t("busStep2.validation.arrivalRequired").replace(
              "{{index}}",
              i + 1,
            ),
            "error",
          );
          return;
        }
        if (
          route.price === null ||
          route.price === undefined ||
          isNaN(route.price)
        ) {
          showSnackbar(
            t("busStep2.validation.invalidPrice").replace("{{index}}", i + 1),
            "error",
          );
          return;
        }
        if (route.price <= 0) {
          showSnackbar(
            t("busStep2.validation.pricePositive").replace("{{index}}", i + 1),
            "error",
          );
          return;
        }
      }

      for (const [i, route] of routes.entries()) {
        const stops = stoppages[route.id];

        if (!stops) {
          showSnackbar(
            t("busStep2.validation.missingStops").replace("{{index}}", i + 1),
            "error",
          );
          return;
        }

        const pickupIncomplete = stops.pickup.some(
          (stop) => !stop.name.trim() || !stop.time.trim(),
        );
        const dropIncomplete = stops.drop.some(
          (stop) => !stop.name.trim() || !stop.time.trim(),
        );

        if (pickupIncomplete || dropIncomplete) {
          showSnackbar(
            t("busStep2.validation.incompleteStops").replace(
              "{{index}}",
              i + 1,
            ),
            "error",
          );
          return;
        }
      }
      // STEP 1: Create bus using POST API
      const formDataToSend = new FormData();
      formDataToSend.append("busName", formData.busName);
      formDataToSend.append("busModelNumber", formData.busModelNumber);
      formDataToSend.append("busRegNumber", formData.busRegNumber);
      formDataToSend.append("assignedDriver", formData.assignedDriver || "");
      formDataToSend.append("status", "active");
      formDataToSend.append("rating", 1);

      // Add amenities
      formData.amenities.forEach((amenity, index) => {
        formDataToSend.append(`amenities[${index}][name]`, amenity.name);
      });

      // Add running days
      formData.runningDays.forEach((day) => {
        formDataToSend.append("runningDays[]", day);
      });

      // Handle busLicenseFront as a File
      if (formData.busLicenseFront?.previewURL) {
        const blob = await fetch(formData.busLicenseFront.previewURL).then(
          (r) => r.blob(),
        );
        const file = new File([blob], "bus-license.jpg", { type: blob.type });
        formDataToSend.append("bus_license_front", file);
      }

      // Handle bus images (either File or blob URL)
      for (const image of formData.busImages) {
        if (image instanceof File) {
          formDataToSend.append("busImages", image);
        } else if (typeof image === "string" && image.startsWith("blob:")) {
          const blob = await fetch(image).then((r) => r.blob());
          const file = new File([blob], "bus-image.jpg", { type: blob.type });
          formDataToSend.append("busImages", file);
        } else {
          console.warn("Unsupported image type:", image);
        }
      }

      // Call API to create bus
      const response = await fetchData(
        "/bus-operator/buses/add",
        "POST",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (!response.success || !response.data?.newBus?._id) {
        showSnackbar(t("busStep2.api.createBusFail"), "error");
        return;
      }

      const busId = response.data._id || response.data.newBus?._id || "";

      // STEP 2: Prepare route data
      if (!busId) {
        showSnackbar(t("busStep2.api.missingBusId"), "error");
        return;
      }

      let allRoutesData = [];
      for (const route of routes) {
        const pickupPoints =
          stoppages[route.id]?.pickup?.filter((p) => p.name && p.time) || [];
        const dropPoints =
          stoppages[route.id]?.drop?.filter((p) => p.name && p.time) || [];

        const routePayload = {
          busId: busId,
          startLocation: route.from,
          endLocation: route.to,
          departureTime: route.departureTime,
          arrivalTime: route.arrivalTime,
          pricePerSeat: route.price,
          ...(pickupPoints.length > 0 && { pickups: pickupPoints }),
          ...(dropPoints.length > 0 && { drops: dropPoints }),
        };

        const res = await fetchData("buses/bus-routes", "POST", routePayload);
        if (res.success && res.data) {
          allRoutesData.push(res.data);
        }
      }

      if (allRoutesData.length > 0) {
        // Save seat layout
        const seatLayoutPayload = { noOfSeats: totalSeats };
        const seatRes = await fetchData(
          `buses/seat-layout/${busId}`,
          "POST",
          seatLayoutPayload,
        );

        if (seatRes.success) {
          dispatch(
            setBusData({
              ...formData,
              _id: busId,
              routes: allRoutesData,
              noOfSeats: totalSeats,
            }),
          );
          showSnackbar(t("busStep2.api.routeSuccess"), "success");
          onSubmit({
            ...formData,
            _id: busId,
            routes: allRoutesData,
            noOfSeats: totalSeats,
          });
        } else {
          showSnackbar(t("busStep2.api.seatLayoutFail"), "warning");
        }
      } else {
        showSnackbar(t("busStep2.api.noRoutes"), "error");
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        t("busStep2.api.genericError");
      showSnackbar(errorMsg, "error");
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div ref={topRef} />
      <SnackbarNotification
        snackbar={snackbar}
        handleClose={handleSnackbarClose}
      />
      <ContentHeading
        heading={t("busStep2.heading")}
        belowHeadingComponent={<ProgressBar step={step} />}
        showSubHeading={true}
        subHeading={
          <div className={styles.seatCounterContainer}>
            <span className={styles.label}>{t("busStep2.totalSeats")}:</span>
            <div className={styles.counter}>
              <button
                onClick={() => setTotalSeats((prev) => Math.max(1, prev - 1))}
              >
                <CiCircleMinus />
              </button>
              <input
                type="number"
                value={totalSeats}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= 200) {
                    setTotalSeats(Math.max(1, value));
                  } else {
                    setTotalSeats(200);
                  }
                }}
                style={{
                  width: "97px",
                  height: "47px",
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <button
                onClick={() => setTotalSeats((prev) => Math.min(100, prev + 1))}
              >
                <CiCirclePlus />
              </button>
            </div>
          </div>
        }
        showBreadcrumbs={true}
        breadcrumbs={t("busStep2.breadcrumbs")}
      />

      {/* Pass routes and setRoutes to BusRoutes */}
      <BusRoutes
        // busId={busId}
        routes={routes}
        setRoutes={setRoutes}
        stoppages={stoppages}
        setStoppages={setStoppages}
      />

      <div className={styles.buttonContainer}>
        <CustomBtn
          onClick={onPrevious}
          label={t("busStep2.previous")}
          className={styles.prevBtn}
          width="160px"
        />
        <CustomBtn
          className={styles.saveBtn}
          onClick={handleSave}
          label={t("busStep2.save")}
          width="160px"
        />
      </div>
    </div>
  );
};

export default Step2;
