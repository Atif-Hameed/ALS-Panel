"use client";
import React, { useState, useEffect, useMemo } from "react"; // Added useEffect
import { API_BASE_URL } from "../../api";
import Button from "../../Components/common/custom-button";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const ExternalLink = ({ userId, setActiveTab }) => {
  const [formData, setFormData] = useState({
    trustPilot: "",
    googleReviews: "",
    propertyLinks: [""],
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [externalData, setExternalData] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/external/get-external/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setExternalData(data.data);

          if (data.data) {
            setFormData({
              trustPilot: data.data.trustPilot || "",
              googleReviews: data.data.googleReviews || "",
              propertyLinks: data.data.propertyLinks?.length
                ? data.data.propertyLinks
                : [""],
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId, loading]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handlePropertyLinkChange = (index, value) => {
    const newLinks = [...formData.propertyLinks];
    newLinks[index] = value;
    setFormData({ ...formData, propertyLinks: newLinks });

    const errorKey = `propertyLink_${index}`;
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[errorKey];
      if (index === 1 && value === newLinks[0]) {
        newErrors[errorKey] =
          "Second link cannot be the same as the first link";
      }
      return newErrors;
    });
  };

  const addPropertyLinkField = () => {
    setFormData({
      ...formData,
      propertyLinks: [...formData.propertyLinks, ""], // Add a new empty string
    });
  };

  const removePropertyLinkField = (indexToRemove) => {
    if (formData.propertyLinks.length <= 1) {
      return;
    }

    const newLinks = formData.propertyLinks.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, propertyLinks: newLinks });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("propertyLink_")) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setErrors({});

    if (!userId) {
      console.error("User ID is missing!");
      setErrors({ general: "User ID is missing. Cannot save." });
      setLoading(false);
      return;
    }
    const isTrustPilotEmpty =
      !formData.trustPilot || formData.trustPilot.trim() === "";
    const isGoogleReviewsEmpty =
      !formData.googleReviews || formData.googleReviews.trim() === "";
    const areAllPropertyLinksEmpty = formData.propertyLinks.every(
      (link) => !link || link.trim() === ""
    );

    if (isTrustPilotEmpty && isGoogleReviewsEmpty && areAllPropertyLinksEmpty) {
      console.log("All fields are empty, skipping save and navigating.");
      setLoading(false);
      // if (setActiveTab) setActiveTab('Account');
      return;
    }
    console.log("Submitting Data:", formData);

    const urlPattern = /^(http:\/\/|https:\/\/).+/;
    let validationErrors = {};

    if (formData.trustPilot && !urlPattern.test(formData.trustPilot)) {
      validationErrors.trustPilot =
        "TrustPilot link must be a valid URL (e.g., https://...)";
    }

    if (formData.googleReviews && !urlPattern.test(formData.googleReviews)) {
      validationErrors.googleReviews =
        "Google Reviews link must be a valid URL (e.g., https://...)";
    }

    const nonEmptyPropertyLinks = formData.propertyLinks.filter(
      (link) => link.trim() !== ""
    );

    nonEmptyPropertyLinks.forEach((link, index) => {
      const originalIndex = formData.propertyLinks.findIndex((l) => l === link);
      const errorKey = `propertyLink_${originalIndex}`;

      if (!urlPattern.test(link)) {
        validationErrors[errorKey] = `Link ${
          originalIndex + 1
        } must be a valid URL (e.g., https://...)`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const dataToSubmit = {
      ...formData,
      propertyLinks: nonEmptyPropertyLinks,
      userId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/external/create-external`, {
        // Changed to upsert potentially
        method: "POST", // Or PUT if updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit), // Send filtered links
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("External links saved successfully!");

      // if (setActiveTab) setActiveTab('Account');

      setFormData((prev) => ({
        ...prev,
        propertyLinks:
          dataToSubmit.propertyLinks.length > 0
            ? dataToSubmit.propertyLinks
            : [""],
      }));
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: error.message || "Failed to save links." });
    } finally {
      setLoading(false);
    }
  };

  const linksToRender =
    formData.propertyLinks.length > 0 ? formData.propertyLinks : [""];

  return (
    <div className="w-full">
      <div className="text-[18px] font-[600] text-[#000000] mb-4 mt-6">
        External Account Links
      </div>
      <form onSubmit={handleSubmit} className="gap-6 w-full flex flex-col ">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-40 gap-y-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            {["trustPilot"].map((field) => {
              const fieldLabel = "Trust Pilot";
              return (
                <div key={field} className="">
                  {focused[field] || formData[field] ? (
                    <label className="text-sm text-gray-600">
                      {fieldLabel}
                    </label>
                  ) : null}
                  <div
                    className={`border-b ${
                      focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                    } ${errors[field] ? "border-red-500" : ""}`} // Highlight error
                  >
                    <input
                      type="text" // Changed to url for better semantics, but text allows flexibility
                      name={field}
                      placeholder={focused[field] ? "" : fieldLabel}
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => handleFocus(field)}
                      onBlur={() => handleBlur(field)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none bg-transparent"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col gap-6">
              {["googleReviews"].map((field) => {
                const fieldLabel = "Google Reviews";
                return (
                  <div key={field} className=" ">
                    {focused[field] || formData[field] ? (
                      <label className="text-sm text-gray-600">
                        {fieldLabel}
                      </label>
                    ) : null}
                    <div
                      className={`border-b ${
                        focused[field] ? "border-[#000113]" : "border-[#CBD5E1]"
                      } ${errors[field] ? "border-red-500" : ""}`} // Highlight error
                    >
                      <input
                        type="text" // Changed to url
                        name={field}
                        placeholder={focused[field] ? "" : fieldLabel}
                        value={formData[field]}
                        onChange={handleChange}
                        onFocus={() => handleFocus(field)}
                        onBlur={() => handleBlur(field)}
                        className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none bg-transparent"
                      />
                    </div>
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-[18px] font-[600] text-[#000000] mb-4 mt-6">
          External Property Links
        </div>

        <div className="flex flex-col gap-6">
          {/* Use linksToRender to ensure at least one field */}
          {linksToRender.map((linkValue, index) => {
            const fieldName = `propertyLink_${index}`;
            const fieldLabel = `Link ${index + 1}`;
            return (
              <div
                key={index}
                className="flex items-end gap-2 md:gap-4 w-full md:w-3/5 lg:w-2/5"
              >
                {" "}
                {/* Adjusted width */}
                <div className="flex-grow">
                  {focused[fieldName] || linkValue ? (
                    <label className="text-sm text-gray-600">
                      {fieldLabel}
                    </label>
                  ) : null}
                  <div
                    className={`border-b ${
                      focused[fieldName]
                        ? "border-[#000113]"
                        : "border-[#CBD5E1]"
                    } ${errors[fieldName] ? "border-red-500" : ""}`} // Highlight error
                  >
                    <input
                      type="text" // Changed to url
                      name={fieldName}
                      placeholder={focused[fieldName] ? "" : fieldLabel}
                      value={linkValue} // Use linkValue from map
                      onChange={(e) =>
                        handlePropertyLinkChange(index, e.target.value)
                      }
                      onFocus={() => handleFocus(fieldName)}
                      onBlur={() => handleBlur(fieldName)}
                      className="w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none bg-transparent"
                    />
                  </div>
                  {errors[fieldName] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[fieldName]}
                    </p>
                  )}
                </div>
                {/* --- Remove Button --- */}
                {linksToRender.length > 1 && ( // Only show remove button if there's more than one link
                  <button
                    type="button"
                    onClick={() => removePropertyLinkField(index)}
                    className="flex-shrink-0 mb-1 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                    aria-label={`Remove ${fieldLabel}`}
                  >
                    <MinusIcon />
                  </button>
                )}
                {/* --- End Remove Button --- */}
                {/* Show Add button only next to the last item */}
                {index === linksToRender.length - 1 && (
                  <button
                    type="button"
                    onClick={addPropertyLinkField}
                    className="flex-shrink-0 mb-1 bg-[#10132F] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#001f36] transition-colors duration-200"
                    aria-label="Add new property link"
                  >
                    <PlusIcon />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
        {errors.general && (
          <p className="text-red-500 text-sm mt-2">{errors.general}</p> // Added margin top
        )}
        {/* <button
					type='submit'
					disabled={loading}
					className={`flex shadowbtn text-[#FFFFFF] cursor-pointer hover:bg-[#004372] font-[700] text-center rounded-[14px] items-center justify-center bg-[#002B4B] w-[140px] h-[48px] mt-4 ${
						loading ? 'opacity-50 cursor-not-allowed' : '' // Removed redundant hover class
					}`}
				>
					{loading ? 'Saving...' : 'Save Changes'}
				</button> */}
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

export default ExternalLink;
