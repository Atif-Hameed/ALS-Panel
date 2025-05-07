"use client";
import React, { useState, useMemo, useEffect } from "react";
import { API_BASE_URL } from "../../api";
import Button from "../../Components/common/custom-button";

const SocailLink = ({ userId, setActiveTab }) => {
  const [formData, setFormData] = useState({
    facebook: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [linkData, setLinkData] = useState(null);
  const [success, setSuccess] = useState("");

  useMemo(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/social/get-link/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setLinkData(data.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId, loading]);

  useEffect(() => {
    if (linkData) {
      setFormData({
        facebook: linkData?.facebook || "",
        linkedin: linkData?.linkedin || "",
        instagram: linkData?.instagram || "",
        twitter: linkData?.twitter || "",
      });
    }
  }, [linkData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
    setLoading(false);
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
      if (
        formData[field] &&
        !formData[field].startsWith("http://") &&
        !formData[field].startsWith("https://")
      ) {
        newErrors[field] = `Invalid URL. Must start with http:// or https://`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // console.log(linkData, 'fgfdg');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setLoading(true);

    const allFieldsEmpty = Object.values(formData).every(
      (value) => value.trim() === ""
    );
    if (allFieldsEmpty) {
      // setActiveTab('External Links');
      setLoading(false);
      return;
    }
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    if (!userId) {
      alert("User ID is required");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/social/create-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      const data = await response.json();
      if (response.ok) {
        // setActiveTab('External Links');
        setSuccess("User data updated successfully!");
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
  const showLabel = (field) => {
    return focused[field] || formData[field];
  };
  return (
    <div className="w-full">
      {/* Profile Section */}
      <div className="text-[18px] font-[600] text-[#000000] mb-4 mt-6">
        Link Social Media Profiles
      </div>
      <form onSubmit={handleSubmit} className="gap-6 w-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-x-20 lg:gap-x-40">
          {/* First Column - Facebook & LinkedIn */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {["facebook", "linkedin"].map((field) => (
              <div key={field} className="w-full">
                {showLabel(field) && (
                  <label className="text-sm text-gray-600">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                )}
                <div
                  className={`border-b ${
                    focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
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

          {/* Second Column - Instagram & Twitter */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {["instagram", "twitter"].map((field) => (
              <div key={field} className="w-full">
                {showLabel(field) && (
                  <label className="text-sm text-gray-600">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                )}
                <div
                  className={`border-b ${
                    focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
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

        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}

        <Button
          type="submit"
          label="Save Changes"
          className="bg-dark rounded-[14px] text-white font-[500] text-center flex items-center justify-center w-[100px] h-[48px]"
          loading={loading}
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default SocailLink;
