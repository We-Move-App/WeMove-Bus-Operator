import React from "react";

const RightSection = ({ heading, description, required = false }) => {
  return (
    <>
      <div className="rightSection">
        <div className="contentBlock">
          <h1>
            {heading} {required && <span style={{ color: "red" }}>*</span>}
          </h1>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
};

export default RightSection;
