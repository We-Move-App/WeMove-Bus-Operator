import React, { useState } from "react";
import styles from "./route-card.module.css";
import images from "../../../../assets/image";
import ExpandedRouteDetails from "./Expanded-Route-Details/ExpandedRouteDetails";

const routes = [
  { id: 1, from: "Bangalore", to: "Pondicherry", time: "10.00 AM" },
  { id: 2, from: "Mumbai", to: "Delhi", time: "12.30 PM" },
  { id: 3, from: "Chennai", to: "Hyderabad", time: "3.45 PM" },
];

const initialStoppages = {
  1: {
    pickup: [
      { id: 1, city: "Bangalore", time: "10:00", period: "AM", fixed: true },
      { id: 2, city: "Haralur", time: "10:00", period: "PM", fixed: true },
    ],
    drop: [
      { id: 1, city: "Pondicherry", time: "08:00", period: "AM", fixed: true },
      { id: 2, city: "Karaikal", time: "09:30", period: "AM", fixed: true },
    ],
  },
  2: {
    pickup: [
      { id: 1, city: "Mumbai", time: "09:00", period: "AM", fixed: true },
      { id: 2, city: "Thane", time: "09:45", period: "AM", fixed: true },
    ],
    drop: [
      { id: 1, city: "Delhi", time: "03:00", period: "PM", fixed: true },
      { id: 2, city: "Noida", time: "04:15", period: "PM", fixed: true },
    ],
  },
  3: {
    pickup: [
      { id: 1, city: "Chennai", time: "06:00", period: "AM", fixed: true },
      { id: 2, city: "Tambaram", time: "06:45", period: "AM", fixed: true },
    ],
    drop: [
      { id: 1, city: "Hyderabad", time: "01:00", period: "PM", fixed: true },
      { id: 2, city: "Secunderabad", time: "01:30", period: "PM", fixed: true },
    ],
  },
};

const RouteCard = () => {
  const [expanded, setExpanded] = useState(routes[0].id);
  const [stoppages, setStoppages] = useState(initialStoppages);

  return (
    <>
      <div className={styles.routeContainer}>
        {routes.map((route) => (
          <div
            key={route.id}
            className={styles.routeCard}
            onClick={() => setExpanded(route.id)}
          >
            <h3>Route Number {route.id}</h3>

            <div className={styles.cardInfo}>
              <div className={styles.routeFrom}>
                <div className={styles.routeImgBlock}>
                  <img src={images.routeImg} alt="" />
                </div>
                <div className={styles.content}>
                  <h4 className={styles.location}>FROM</h4>
                  <h3 className={styles.cityName}>{route.from}</h3>
                  <h3 className={styles.time}>{route.time}</h3>
                </div>
              </div>
              <div className={styles.routeTo}>
                <div className={styles.routeImgBlock}>
                  <img src={images.routeImg} alt="" />
                </div>
                <div className={styles.content}>
                  <h4 className={styles.location}>TO</h4>
                  <h3 className={styles.cityName}>{route.to}</h3>
                  <h3 className={styles.time}>{route.time}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ExpandedRouteDetails
        route={routes.find((r) => r.id === expanded)}
        stoppages={stoppages}
        setStoppages={setStoppages}
      />
    </>
  );
};

export default RouteCard;
