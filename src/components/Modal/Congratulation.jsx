import React, { useEffect } from "react";
import LogInLeft from "../Reusable/LogInLeft";
import styles from "./congratulation.module.css";
import images from "../../assets/image";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const Congratulation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 5000);
  }, []);
  return (
    <div className="logInSection">
      <LogInLeft />
      <div className="rightSectionContainer">
        <div className="rightContentBlock">
          <div className={styles.thankYouContainer}>
            <div className={styles.checkIcon}>
              <img src={images.checkIcon} alt="check-icon" />
            </div>
            <h1>Submission Received!</h1>
            <h2>
              Thank you for filling out the form. Your request is under review
              and will be approved by an admin shortly.
            </h2>
            <RotatingLines
              visible={true}
              height="52"
              width="52"
              strokeColor="#2D6A4F"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Congratulation;
