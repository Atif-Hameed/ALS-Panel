import React from "react";


const Heading = ({ children, className }) => {
  return (
    <h1
      className={`lg:text-6xl sm:text-5xl text-4xl font-bold font-alice  lg:leading-[78px] text-center capitalize text-white   ${className}`}
    >
      {children}
    </h1>
  );
};

export default Heading;
