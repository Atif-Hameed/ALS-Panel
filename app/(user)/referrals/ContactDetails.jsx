"use client";
import React, { useState } from "react";

const ContactDetails = () => {
  const [formData, setFormData] = useState({
    email: "",
    additionalEmail: "",
    otherPhone: "",
    faxnumber: "",
    officePhone: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [selected, setSelected] = useState("hide");
  const [selected1, setSelected1] = useState("yes");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        const fieldName = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        newErrors[field] = `${fieldName} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderInput = (field, placeholderText) => (
    <div key={field} className="w-full">
      {(focused[field] || formData[field]) && (
        <label className="text-sm text-[#4A5568]">{placeholderText}</label>
      )}
      <div
        className={`border-b ${
          focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
        }`}
      >
        <input
          type={field === "websiteUrl" ? "url" : "text"}
          name={field}
          placeholder={focused[field] ? "" : placeholderText}
          value={formData[field]}
          onChange={handleChange}
          onFocus={() => handleFocus(field)}
          onBlur={() => handleBlur(field)}
          className="w-full py-2 text-[14px] font-[400] text-[#2D3748] focus:ring-0 focus:outline-none bg-transparent placeholder-[#718096]"
        />
      </div>
      {errors[field] && (
        <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="w-full h-full">
      <div className="text-[18px] font-[600] text-[#000000] mb-4 ">
        Contact Details
      </div>
      <form className="w-full flex flex-col gap-y-6">
        <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:gap-x-16 ">
          <div className="flex flex-col col-span-2 gap-6">
            {renderInput("email", "Email Address")}
          </div>
        </div>
        <div className="">
          <div className="text-[18px] font-[600] text-[#000000] ">
            Show details on website?
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                value="show"
                checked={selected === "show"}
                onChange={() => setSelected("show")}
                className="hidden"
              />
              <span
                className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                  selected === "show" ? "border-blue-500" : "border-gray-400"
                }`}
              >
                {selected === "show" && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </span>
              <span
                className={`text-${
                  selected === "show" ? "black font-bold" : "gray-600"
                }`}
              >
                Show
              </span>
            </label>

            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                value="hide"
                checked={selected === "hide"}
                onChange={() => setSelected("hide")}
                className="hidden"
              />
              <span
                className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                  selected === "hide" ? "border-blue-500" : "border-gray-400"
                }`}
              >
                {selected === "hide" && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </span>
              <span
                className={`text-${
                  selected === "hide" ? "black font-bold" : "gray-600"
                }`}
              >
                Hide
              </span>
            </label>
          </div>
        </div>
        <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:gap-x-16 ">
          <div className="flex flex-col col-span-2 gap-6">
            {renderInput("additionalEmail", "Additional Emails")}
            {renderInput("mobile", "Mobile Numbers")}
          </div>
        </div>

        <div className="">
          <div className="text-[18px] font-[600] text-[#000000] ">
            Text new leads to mobile phone(s)
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                value="yes"
                checked={selected1 === "yes"}
                onChange={() => setSelected1("yes")}
                className="hidden"
              />
              <span
                className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                  selected1 === "yes" ? "border-blue-500" : "border-gray-400"
                }`}
              >
                {selected1 === "yes" && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </span>
              <span
                className={`text-${
                  selected1 === "yes" ? "black font-bold" : "gray-600"
                }`}
              >
                yes
              </span>
            </label>

            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                value="No"
                checked={selected1 === "No"}
                onChange={() => setSelected1("No")}
                className="hidden"
              />
              <span
                className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                  selected1 === "No" ? "border-blue-500" : "border-gray-400"
                }`}
              >
                {selected1 === "No" && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </span>
              <span
                className={`text-${
                  selected1 === "No" ? "black font-bold" : "gray-600"
                }`}
              >
                No
              </span>
            </label>
          </div>
        </div>
        <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:gap-x-16 ">
          <div className="flex flex-col col-span-2 gap-6">
            {renderInput("officePhone", "Office Phone")}
            {renderInput("faxnumber", "Fax Number")}
            {renderInput("otherPhone", "Other Phone")}
          </div>
        </div>
        <button className="flex shadowbtn cursor-pointer hover:bg-[#004372] text-[#FFFFFF] font-[700] text-center rounded-[14px] items-center justify-center bg-[#002B4B] w-[140px] h-[48px]">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ContactDetails;
