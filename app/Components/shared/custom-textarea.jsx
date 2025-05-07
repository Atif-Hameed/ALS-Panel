"use client";

import React from "react";
import Image from "next/image";

const CustomTextarea = ({
    label,
    placeholder,
    icon,
    name,
    style,
    textareaStyle,
    error,
    onChange,
    onBlur,
    value,
    description,
    className,
    rows = 4,
}) => {
    const textareaClass = `text-secondary text-sm border ${error ? "border-error" : "border-transparent"
        } py-3 focus:outline-none block w-full`;

    const containerClass = `relative ${error ? "pb-6" : ""}`;

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
                <div className={`relative flex ${textareaClass}`}>
                    <textarea
                        placeholder={placeholder}
                        name={name}
                        id={name}
                        value={value}
                        rows={rows}
                        className={`w-full outline-none text-darkGray2 px-2 py-3 border rounded-lg bg-white border-black ${textareaStyle}`}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                </div>
                {description && (
                    <p className="text-xs text-gray-500 mt-1 px-2">{description}</p>
                )}
                {error && (
                    <span className="absolute text-xs text-error mt-1">{error}</span>
                )}
            </div>
        </div>
    );
};

export default CustomTextarea;