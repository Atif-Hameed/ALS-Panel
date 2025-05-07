"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";


const CustomInput = (
  {
    label,
    inputType,
    placeholder,
    icon,
    name,
    style,
    inputStyle,
    error,
    onChange,
    onBlur,
    value,
    description,
    className,
    showCross,
    onClear,
    onKeyDown
  }
) => {


  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const inputClass = `text-secondary text-sm border ${error ? "border-error" : "border-transparent"
    }  py-3 focus:outline-none block w-full  `;

  const containerClass = `relative  ${error ? "pb-6" : ""}`;

  return (
    <div className={`flex flex-col w-full ${style} ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 px-2 text-sm sm:text-base font-normal text-primary"
        >
          {label}
        </label>
      )}
      <div className={containerClass}>
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src={icon} alt="" />
          </div>
        )}
        <div className={`relative flex ${inputClass} `}>
          <input
            type={inputType === "password" && showPassword ? "text" : inputType}
            placeholder={placeholder}
            name={name}
            id={name}
            value={value}
            className={`w-full  outline-none text-darkGray2 px-2 py-3 border rounded-lg bg-white border-black ${inputStyle}`}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          {showCross && (
            <button className="absolute right-0 group px-3 py-5 cursor-pointer top-1.5" onClick={handleClear}>
              <RxCross2
                className=" text-lg text-red-600 group-hover:text-red-800 cursor-pointer"
              />
            </button>
          )}
          {inputType === "password" && (
            <div
              className="flex items-center justify-center max-w-10"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <IoIosEyeOff size={20} />
              ) : (
                <IoIosEye size={20} />
              )}
            </div>
          )}
        </div>
        {error && (
          <span className="absolute text-xs text-error mt-1">{error}</span>
        )}

      </div>
    </div>
  );
};

export default CustomInput;
