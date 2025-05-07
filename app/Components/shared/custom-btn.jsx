"use client";
import { Loader2 } from "lucide-react";
import React from "react";


const Button = ({
  label = "Button", 
  onClick,
  style = "", 
  type = "button", 
  loadingLabel = "Loading...", 
  disabled = false, 
  loading = false, 
  icon,
  iconPosition = "right",
  loaderStyle
}) => {
  return (
    <div className="">
      <button
        className={`py-2  cursor-pointer md:px-7  border border-white  px-5 xl:text-lg lg:text-base text-base min-w-fit justify-center  text-white flex items-center hover:scale-105 duration-300 transition-all gap-2 ${disabled ? "bg-opacity-50 cursor-not-allowed" : ""
          } ${style}`}
        onClick={!disabled && !loading ? onClick : undefined}
        disabled={disabled}
        type={type}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 className={`h-8 w-8 animate-spin ${loaderStyle}`} />
            <span>{loadingLabel}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && icon}
            {label}
            {icon && iconPosition === "right" && icon}
          </>
        )}
      </button>
    </div>
  );
};

export default Button;