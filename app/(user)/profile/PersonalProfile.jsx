"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TabSwitcher from "./TabSwitcher";
import { API_BASE_URL } from "../../api";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import Button from "../../Components/common/custom-button";
import "react-phone-input-2/lib/style.css"; // Make sure you import the base styles
import toast from "react-hot-toast";
import { RiInformationLine } from "react-icons/ri";
import { uploadProfileImageToCloudinary } from "../../Components/utils/cloudinaryUploader";
import { countryOptions } from "../../utils/countries";
import { getUserLocation } from "../../utils/get-location";

const PersonalProfile = ({ userData, userId, setActiveTab }) => {
  console.log("userId888888", userData);
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    designation: userData?.designation || "",
    publicName: userData?.publicName || "",
    userName: userData?.userName || "",
    officeName: userData?.officeName || "",
    street: userData?.street || "",
    apartment: userData?.apartment || "",
    city: userData?.city || "",
    state: userData?.state || "",
    zipCode: userData?.zipCode || "",
    country: userData?.country || "",
    address1: userData?.address1 || "",
    companyName: userData?.companyName || "",
    latitude: userData?.latitude || "",
    logitude: userData?.logitude || "",
    address2: userData?.address2 || "",
    aboutMe: userData?.aboutMe || "",
    phoneNumber: userData?.phoneNumber || "",
    whatsappNumber: userData?.whatsappNumber || "",
    telegram: userData?.telegram || "",
    taxNumber: userData?.taxNumber || "",
    lineId: userData?.lineId || "",
    faxNumber: userData?.faxNumber || "",
    source: userData?.source || "",
    specialities: userData?.specialities || "",
    serviceAreas: userData?.serviceAreas || "",
    businessCardLink: userData?.businessCardLink || "",
    licenseType: userData?.licenseType || "",
    licenseNumber: userData?.licenseNumber || "",
    association: userData?.association || "",
    agency: userData?.agency || "",
    expiryDate: userData?.expiryDate || "",
    accountType: userData?.accountType || "",
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [domData, setDomData] = useState({
    latitude: userData?.latitude || "",
    logitude: userData?.logitude || "",
  });



  useEffect(() => {
    if (userData) {

      const storedLat = localStorage.getItem("userLat");
      const storedLng = localStorage.getItem("userLong");

      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        designation: userData.designation || "",
        publicName: userData.publicName || "",
        userName: userData.userName || "",
        officeName: userData.officeName || "",
        street: userData.street || "",
        apartment: userData.apartment || "",
        city: userData.city || "",
        state: userData.state || "",
        zipCode: userData.zipCode || "",
        country: userData.country || "",
        address1: userData.address1 || "",
        companyName: userData.companyName || "",
        latitude: userData.latitude || storedLat || "",
        logitude: userData.logitude || storedLng || "",
        address2: userData.address2 || "",
        aboutMe: userData.aboutMe || "",
        phoneNumber: userData.phoneNumber || "",
        whatsappNumber: userData.whatsappNumber || "",
        telegram: userData.telegram || "",
        taxNumber: userData.taxNumber || "",
        lineId: userData.lineId || "",
        faxNumber: userData.faxNumber || "",
        source: userData.source || "",
        specialities: userData.specialities || "",
        serviceAreas: userData.serviceAreas || "",
        licenseType: userData?.licenseType || "",
        agency: userData?.agency || "",
        licenseNumber: userData?.licenseNumber || "",
        association: userData?.association || "",
        expiryDate: userData?.expiryDate || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For zipCode field: Allow only numbers
    if (name === "zipCode") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      setFormData({ ...formData, [name]: numericValue });
    }
    // For city and state fields: Allow only letters and spaces
    else if (name === "city" || name === "state") {
      const alphabeticValue = value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters (except spaces)
      setFormData({ ...formData, [name]: alphabeticValue });
    }
    // For other fields: Allow default input
    else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
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
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "designation",
      "publicName",
      "userName",
      "street",
      "address1",
      "country",
      "zipCode",
      "state",
      "city",
      "phoneNumber",
    ];

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        const fieldNameReadable = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());

        newErrors[field] = `${fieldNameReadable} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    let updatedFormData = { ...formData }; // Clone formData to update it

    if (profileImageFile) {
      try {
        console.log("Uploading profile image to Cloudinary...");
        const profileurl = await uploadProfileImageToCloudinary(
          profileImageFile
        );
        console.log("Cloudinary Upload Success:", profileurl);

        updatedFormData.profileImage = profileurl; // Add profile image URL to formData
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        setErrors({
          ...errors,
          imageUpload: `Failed to upload profile image: ${uploadError.message}`,
        });
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/update-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // setActiveTab('Social Links');
        setSuccess("User data updated successfully!");
        toast.success("update saved successfully");
        // setTimeout(() => {
        // 	setShowSuccess(true);
        // 	setLoading(false);

        // 	// Hide after 3 seconds
        // 	setTimeout(() => setShowSuccess(false), 3000);
        // }, 1000);
      } else {
        setErrors({ general: data.message || "Failed to update user" });
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImageFile(file); // Store the file object

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result); // Set the preview URL (base64 string)
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImageFile(null);
      setProfileImagePreview(null);
      // Optionally show an error message
      console.log("Please select a valid image file.");
    }
  };

  const showLabel = (field) => {
    return focused[field] || formData[field];
  };


  const validateCoordinate = (value, field) => {
    if (!value) return false;

    const num = parseFloat(value);
    if (isNaN(num)) return false;

    if (field === 'latitude') {
      return num >= -90 && num <= 90;
    } else if (field === 'logitude') {
      return num >= -180 && num <= 180;
    }
    return false;
  };

  const getErrorMessage = (value, field) => {
    if (!value) return `${field} is required`;

    const num = parseFloat(value);
    if (isNaN(num)) return 'Must be a number';

    if (field === 'latitude') {
      return 'Latitude must be between -90 and 90';
    } else if (field === 'logitude') {
      return 'Longitude must be between -180 and 180';
    }
    return 'Invalid value';
  };

  return (
    <div className=" w-full h-[58vh] overflow-y-scroll">
      {/* Profile Section */}
      <div className="text-[18px] font-[600] text-[#000000] mb-4 mt-6">
        Personal Profile
      </div>
      <form onSubmit={handleSubmit} className="gap-6 w-full flex flex-col ">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 lg:gap-x-40 gap-x-20 gap-y-6">
          {/* First Name & Last Name */}
          <div className="lg:col-span-2 md:col-span-1 col-span-full flex flex-col gap-6">
            <div className="flex flex-row sm:flex-row gap-6">
              {["firstName", "lastName"].map((field) => (
                <div key={field} className="sm:w-1/2 w-full">
                  {/* Label always shown */}
                  <label className="text-sm text-gray-600">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : `${field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                          } *`
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                      required
                    />
                  </div>

                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Email & Designation */}
            <div className="flex flex-col gap-6">
              {["email", "designation"].map((field) => (
                <div key={field} className="w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                      required
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User Name & Public Name */}
          <div className="lg:col-span-2 md:col-span-1 col-span-full">
            <div className="flex flex-col gap-6">
              {["userName", "publicName"].map((field) => (
                <div key={field} className="w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type={field.includes("password") ? "password" : "text"}
                      name={field}
                      placeholder={
                        field === "email"
                          ? "Enter your email"
                          : focused[field]
                            ? ""
                            : field.charAt(0).toUpperCase() +
                            field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                      required
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Profile Image Upload */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-20 rounded-md border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100">
                {profileImagePreview || userData?.profileImage ? (
                  <img
                    src={profileImagePreview || userData?.profileImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">Preview</span>
                )}
              </div>
              <label
                htmlFor="profileImageInput"
                className="text-[#475569] font-[400] text-[14px] cursor-pointer hover:text-black"
              >
                {profileImagePreview
                  ? "Change Profile Image"
                  : "Upload Profile Image"}
              </label>

              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Company Details & Address */}

        <div className="text-[18px] font-[600] text-[#000000] my-4">
          Company Details & Address
        </div>
        <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-1 lg:gap-x-40 gap-x-20 gap-y-6">
          {/* Left Column */}
          <div className="lg:col-span-2 md:col-span-2 col-span-full flex flex-col gap-6">
            {/* Office Name */}
            <div className="flex flex-col gap-6">
              {["officeName"].map((field) => (
                <div key={field} className="w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* City & State - Stack on mobile */}
            <div className="flex flex-row sm:flex-row gap-6">
              {["city", "state"].map((field) => (
                <div key={field} className="sm:w-1/2 w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                      <span className="text-red-500"> *</span>
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      onKeyDown={(e) => {
                        if (
                          (field === "city" || field === "state") &&
                          /\d/.test(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Street & Apartment - Stack on mobile */}
            <div className="flex flex-row sm:flex-row gap-6">
              {["street", "apartment"].map((field) => (
                <div key={field} className="sm:w-1/2 w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                      <span className="text-red-500"> *</span>
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Address1 */}
            <div className="flex flex-col gap-6">
              {["address1"].map((field) => (
                <div key={field} className="w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                      <span className="text-red-500"> *</span>
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 md:col-span-2 col-span-full flex flex-col gap-6">
            {/* Company Name */}
            <div className="flex flex-col gap-6">
              {["companyName"].map((field) => (
                <div key={field} className="w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Zip Code & Country - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Zip Code */}
              {["zipCode"].map((field) => (
                <div key={field} className="sm:w-1/2 w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                      <span className="text-red-500"> *</span>
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}

              {/* Country - Full width on mobile */}
              <div className="sm:w-1/2 w-full border-[#CBD5E1] border-b">
                <label className="text-sm text-gray-600">
                  Country<span className="text-red-500"> *</span>
                </label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === formData.country
                  )}
                  onChange={(selectedOption) =>
                    setFormData({ ...formData, country: selectedOption.value })
                  }
                  onFocus={() => handleFocus("country")}
                  onBlur={() => handleBlur("country")}
                  placeholder="Country"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "none",
                      boxShadow: "none",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "#000113",
                      fontSize: "14px",
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                    }),
                    menu: (provided) => ({
                      ...provided,
                      color: "#000113",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      color: "#000113",
                      backgroundColor: state.isFocused ? "#CBD5E1" : "white",
                      "&:hover": { backgroundColor: "#CBD5E1" },
                    }),
                  }}
                  className="w-full"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm">{errors.country}</p>
                )}
              </div>
            </div>

            {/* Latitude & Longitude - Stack on mobile */}
            <div className="">
              <div className="flex flex-row sm:flex-row gap-6">
                {["latitude", "logitude"].map((field) => (
                  <div key={field} className="sm:w-1/2 w-full">
                    {showLabel(field) && (
                      <label className="text-sm text-gray-600">
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                    )}
                    <div
                      className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                        }`}
                    >
                      <input
                        type="text"
                        required
                        name={field}
                        placeholder={
                          focused[field]
                            ? ""
                            : field.charAt(0).toUpperCase() +
                            field.slice(1).replace(/([A-Z])/g, " $1")
                        }
                        value={formData[field]}
                        onChange={(e) => {
                          // Validate input before updating state
                          const value = e.target.value;
                          const isValid = validateCoordinate(value, field);
                          handleChange(e); // Your existing change handler

                          // Set error if invalid
                          setErrors(prev => ({
                            ...prev,
                            [field]: isValid ? null : getErrorMessage(value, field)
                          }));
                        }}
                        onFocus={() => handleFocus(field)}
                        onBlur={() => {
                          handleBlur(field);
                          // Final validation on blur
                          const isValid = validateCoordinate(formData[field], field);
                          setErrors(prev => ({
                            ...prev,
                            [field]: isValid ? null : getErrorMessage(formData[field], field)
                          }));
                        }}
                        className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                      />
                    </div>
                    {errors[field] && (
                      <p className="text-red-500 text-sm">{errors[field]}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center pt-2 gap-2 text-[#024673] text-sm">
                <span><RiInformationLine /></span>
                <span className="text-xs">Please add latitude and longitude so your profile can appear on map search</span>
              </div>
            </div>

            {/* Address2 */}
            <div className="flex flex-col gap-6">
              {["address2"].map((field) => (
                <div key={field} className="w-full">
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About me*/}

        <div className="text-[18px] font-[600] text-[#000000] my-4">
          About me{" "}
        </div>
        <div className="grid lg:grid-cols-5 md:grid-cols-4 lg:gap-x-40 gap-x-20  ">
          <div className=" col-span-4  ">
            {["aboutMe"].map((field) => (
              <div key={field} className="">
                <div
                  className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                    }`}
                >
                  <input
                    type="text"
                    name={field}
                    placeholder={"Write here..."}
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(field)}
                    onBlur={() => handleBlur(field)}
                    className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                  />
                </div>
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* contect details */}
        <div className="text-[18px] font-[600] text-[#000000] my-4">
          Contact Details
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 lg:gap-x-20">
          {/* Left 3 Fields */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            {["phoneNumber", "telegram", "taxNumber"].map((field) => (
              <div key={field}>
                {showLabel(field) && (
                  <label className="text-sm text-gray-600">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                    {field === "phoneNumber" && (
                      <span className="text-red-500"> *</span>
                    )}
                  </label>
                )}
                <div
                  className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                    }`}
                >
                  {field === "phoneNumber" ? (
                    <PhoneInput
                      country={"us"}
                      value={formData[field]}
                      placeholder={focused[field] ? "" : "Phone"}
                      onChange={(value) =>
                        handleChange({
                          target: { name: field, value },
                        })
                      }
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      inputClass="!w-full !py-2 !text-[14px] !font-[400] !text-[#000113] !border-0 !bg-transparent !focus:ring-0 !focus:outline-none"
                      buttonClass="!border-0 !bg-transparent"
                      containerClass="!w-full !bg-transparent !p-0"
                      inputProps={{
                        name: field,
                        required: true, // Only for phoneNumber
                        autoComplete: "off",
                      }}
                      specialLabel=""
                    />
                  ) : (
                    <input
                      type="number"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none bg-transparent"
                    />
                  )}
                </div>
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Right 3 Fields */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6 mt-8 md:mt-0">
            {["whatsappNumber", "lineId", "faxNumber"].map((field) => (
              <div key={field}>
                {showLabel(field) && (
                  <label className="text-sm text-gray-600">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                )}
                <div
                  className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                    }`}
                >
                  {field === "whatsappNumber" ? (
                    <PhoneInput
                      country={"us"}
                      value={formData[field]}
                      placeholder={focused[field] ? "" : "WhatsApp"}
                      onChange={(value) =>
                        handleChange({
                          target: { name: field, value },
                        })
                      }
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      inputClass="!w-full !py-2 !text-[14px] !font-[400] !text-[#000113] !border-0 !bg-transparent !focus:ring-0 !focus:outline-none"
                      buttonClass="!border-0 !bg-transparent"
                      containerClass="!w-full !bg-transparent !p-0"
                      inputProps={{
                        name: field,
                        required: true,
                        autoComplete: "off",
                      }}
                      specialLabel=""
                    />
                  ) : (
                    <input
                      type="number"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none bg-transparent"
                    />
                  )}
                </div>
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-[18px] font-[600] text-[#000000] my-4">
          License Details
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-6 md:gap-x-12 lg:gap-x-40 gap-y-8">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {["licenseType", "licenseNumber", "association"].map((field) => (
                <div key={field}>
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {["agency", "expiryDate", "accountType"].map((field) => (
                <div key={field}>
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type={field === "expiryDate" ? "date" : "text"}
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[18px] font-[600] text-[#000000] my-4">
          Other Details
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-10 lg:gap-x-40 gap-y-6">
          {/* Left Side Fields */}
          <div className="col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {["source", "specialities"].map((field) => (
                <div key={field}>
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Fields */}
          <div className="col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {["serviceAreas"].map((field) => (
                <div key={field}>
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        focused[field]
                          ? ""
                          : field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              {["businessCardLink"].map((field) => (
                <div key={field}>
                  {showLabel(field) && (
                    <label className="text-sm text-gray-600">
                      QR Code / Business Card Link
                    </label>
                  )}
                  <div
                    className={`border-b ${focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      }`}
                  >
                    <input
                      type="text"
                      name={field}
                      placeholder="QR Code / Business Card Link"
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <button
					className='flex shadowbtn cursor-pointer hover:bg-[#004372] text-[#FFFFFF] font-[700] text-center rounded-[14px] items-center justify-center bg-[#002B4B] w-[140px] h-[48px]'
					disabled={loading}
				>
					{loading ? 'Updating...' : 'Save Changes'}
				</button> */}
        {/* {showSuccess && (
					<div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fadeIn">
						<svg
							className="w-5 h-5 text-green-600"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						<span className="font-medium">Changes saved successfully!</span>
					</div>
				)} */}
        <div className="mt-4">
          {/* {success && <p className='text-green-500'>{success}</p>} */}
          {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        </div>

        <Button
          type="submit"
          label="Save Changes"
          className="bg-dark rounded-[14px] text-white font-[500] text-center flex items-center justify-center w-[100px] h-[48px]"
          loading={loading}
          disabled={loading}
        />
        {/* {loading ? 'Saving...' : 'Save Changes'}</Button> */}
      </form>
    </div>
  );
};

export default PersonalProfile;
