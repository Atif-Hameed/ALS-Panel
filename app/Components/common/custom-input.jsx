"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const CustomInput = ({
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
    className,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false); // Track focus for date input

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputClass = `border-b ${error ? "border-error" : "border-border"} py-2 focus:outline-none block w-full`;
    const containerClass = `relative bg-transparent ${error ? "pb-2" : ""}`;

    // Dynamic type logic
    const getInputType = () => {
        if (inputType === "password") {
            return showPassword ? "text" : "password";
        }
        if (inputType === "date") {
            return isFocused ? "date" : "text";
        }
        return inputType;
    };

    return (
        <div className={`flex flex-col w-full ${style} ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block mb-1.5 capitalize text-sm sm:text-base font-medium text-black"
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
                <div className={`relative flex ${inputClass} ${inputStyle}`}>
                    <input
                        type={getInputType()}
                        placeholder={placeholder}
                        name={name}
                        id={name}
                        value={value}
                        className="w-full bg-transparent focus:outline-none text-darkGray placeholder:text-darkGray"
                        onChange={onChange}
                        
                        onBlur={(e) => {
                            setIsFocused(false); // optional: keep it "date" after focus
                            onBlur?.(e);
                        }}
                        onFocus={() => setIsFocused(true)}
                    />
                    {inputType === "password" && (
                        <button
                            type="button"
                            className="flex items-center justify-center max-w-10 ml-2"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomInput;
