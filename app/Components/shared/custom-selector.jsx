"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";

const CustomSelect = ({
  label = "Select",
  placeholder = "Select an option",
  icon,
  name,
  style,
  selectStyle,
  error,
  onChange,
  onBlur,
  value,
  description,
  className,
  options = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (optionValue) => {
    if (onChange) {
      onChange(optionValue); // <-- send only the value
    }
    setIsOpen(false);
    if (onBlur) onBlur(); // optional, you can pass more info if needed
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`flex flex-col w-full ${style} ${className}`} ref={selectRef}>
      {
        label &&
        <label
        htmlFor={name}
        className="block mb-2 px-2 text-sm sm:text-base font-normal text-black"
      >
        {label}
      </label>
      }
      
      <div className={`relative ${error ? "pb-6" : ""}`}>
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src={icon} alt="" />
          </div>
        )}
        <div className="relative">
          <button
            type="button"
            className={`w-full outline-none text-darkGray2 px-2 py-2.5 border rounded-lg bg-white ${error ? "border-error" : "border-black"} ${selectStyle} cursor-pointer flex justify-between items-center text-left`}
            onClick={toggleDropdown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={!value ? "text-[#878787]" : "text-black"}>
              {selectedLabel}
            </span>
            <FiChevronDown
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <ul
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
              role="listbox"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    value === option.value ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
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

export default CustomSelect;
