import React from "react";
import images from "../../assets/image";

const LogInLeft = () => {
  return (
    <>
      <div className="leftSection">
        <div className="logoBlock">
          <img src={images.logo} alt="login logo" />
        </div>
      </div>
    </>
  );
};

export default LogInLeft;
