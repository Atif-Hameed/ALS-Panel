"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const CustomSelector = ({
    label,
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
    options,
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close all other dropdowns when this one opens
    useEffect(() => {
        if (isOpen) {
            const closeAllDropdowns = () => setIsOpen(false);
            document.addEventListener('click', closeAllDropdowns);
            return () => document.removeEventListener('click', closeAllDropdowns);
        }
    }, [isOpen]);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (optionValue) => {
        setSelectedValue(optionValue);
        onChange?.(optionValue);
        setIsOpen(false);
    };

    const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder;

    const inputClass = `border-b ${error ? "border-error" : "border-border"} py-2 focus:outline-none block w-full`;

    const containerClass = `relative bg-transparent ${error ? "pb-2" : ""}`;

    return (
        <div className={`flex flex-col z-40 w-full ${style} ${className}`} ref={dropdownRef}>
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
                <div
                    className={`relative flex ${inputClass} ${inputStyle}`}
                    onClick={toggleDropdown}
                    onBlur={onBlur}
                    tabIndex={0}
                >
                    <div className="w-full bg-transparent focus:outline-none text-darkGray">
                        {selectedLabel}
                    </div>
                    <div className="flex items-center justify-center max-w-10">
                        {isOpen ? (
                            <FiChevronUp size={20} className="text-inputGray" />
                        ) : (
                            <FiChevronDown size={20} className="text-inputGray" />
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="sticky  z-40 w-full mt-1 bg-white border border-darkGray rounded-md shadow-lg max-h-60 overflow-auto">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`px-4 py-2 hover:bg-dark text-dark hover:text-white cursor-pointer ${selectedValue === option.value ? "bg-gray-200 font-medium" : ""
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOptionClick(option.value.toString());
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <span className="absolute text-xs text-red-500">{error}</span>
                )}
            </div>
        </div>
    );
};

export default CustomSelector;