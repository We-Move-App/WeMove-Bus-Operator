import React from "react";

const RightSection = ({ heading, description }) => {
  return (
    <>
      <div className="rightSection">
        <div className="contentBlock">
          <h1>{heading}</h1>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
};

export default RightSection;
