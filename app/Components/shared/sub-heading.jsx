import React from "react";

const SubHeading = ({ children, styles }) => {
  return (
    <h3
      className={` text-center  xl:text-4xl lg:text-3xl text-2xl  ${styles}`}
    >
      {children}
    </h3>
  );
};

export default SubHeading;
