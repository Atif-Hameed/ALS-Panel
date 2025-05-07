
import Link from "next/link";
import React from "react";


const CustomLink = ({
  href,
  children,
  className,
  onClick
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={` cursor-pointer hover:text-blue  duration-300 transition-all   ${className}`}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
