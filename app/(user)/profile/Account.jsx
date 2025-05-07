import React, { useState, useRef, useEffect } from "react";
import { uploadImagesToCloudinary } from "../../Components/utils/cloudinaryUploader";
import { API_BASE_URL } from "../../api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Select from "react-select";
import Button from "../../Components/common/custom-button";
import toast from "react-hot-toast";
import Modal from "../../Components/common/modal";

import { useRouter } from "next/navigation";
const roleOptions = [
  { value: "Agent", label: "Agent" },
  { value: "Buyer", label: "Buyer" },
  { value: "Broker", label: "Broker" },
  { value: "Realtor", label: "Realtor" },
  { value: "Landlord", label: "Landlord" },
  { value: "Property Owner", label: "Property Owner" },
  { value: "Property Manager", label: "Property Manager" },
  { value: "Listing Agent", label: "Listing Agent" },
  { value: "Seller's Agent", label: "Seller's Agent" },
  { value: "Building Manager", label: "Building Manager" },
  { value: "Commercial Broker", label: "Commercial Broker" },
  { value: "Developer", label: "Developer" },
  { value: "Builder", label: "Builder" },
  { value: "Architect", label: "Architect" },
];

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8 text-white"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const Account = ({ userId, userData }) => {
  const router = useRouter();
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryImagesprev, setGalleryImagesprev] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    role: "",
    changePassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formLoading1, setFormLoading1] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formSucces, setFormSucces] = useState("");
  const [formError, setFormError] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [formuid, setFormuid] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [modalType, setModalType] = useState(null); // 'image' or 'account'

  useEffect(() => {
    // console.log('Attempting to fetch gallery for userId:', userId);
    if (userId) {
      fetch(`${API_BASE_URL}/gallery/get-gallery/${userId}`)
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            console.error("Backend error response:", data);
            throw new Error(
              data?.message ||
                response.statusText ||
                `HTTP error! Status: ${response.status}`
            );
          }

          if (
            data &&
            data.gallery &&
            Array.isArray(data.gallery.galleryImages)
          ) {
            const fetchedImages = data.gallery.galleryImages.map(
              (url, index) => ({
                file: null,
                previewUrl: url,
                id: `fetched-${userId}-${index}-${Date.now()}`,
              })
            );

            setGalleryImagesprev(fetchedImages);
            setUploadError("");
          } else if (
            data &&
            data.message === "Gallery not found for this user."
          ) {
            setGalleryImagesprev([]);
            setUploadError("");
          } else {
            console.warn(
              "Received successful response, but gallery data is missing or in unexpected format:",
              data
            );
            setGalleryImagesprev([]);
            setUploadError("Failed to parse gallery data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user gallery:", error);
          // setUploadError(`Failed to load gallery: ${error.message}`);
          setGalleryImagesprev([]);
        });
    } else {
      console.log("userId is not available yet. Skipping gallery fetch.");
    }
  }, [userId, delLoading]);

  useEffect(() => {
    if (userData) {
      setFormData({
        role: userData || "",
      });
    }
  }, [userData]);

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      setUploadError("");
      setUploadSuccess("");
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setGalleryImages((prevImages) => [
          ...prevImages,
          {
            file: file,
            previewUrl: reader.result,
            id: Date.now() + Math.random(),
          },
        ]);
      };

      reader.readAsDataURL(file);
    } else {
      console.log("No file selected or file is not an image.");
      setUploadError("Please select a valid image file.");
    }

    if (event.target) {
      event.target.value = null;
    }
  };

  const handleSaveImages = async (e) => {
    e.preventDefault();
    if (!userId) {
      setFormuid("Cannot save images: User information is missing.");
      return;
    }
    if (galleryImages.length === 0) {
      setUploadError("No images selected to upload.");
      return;
    }

    const filesToUpload = galleryImages.map((img) => img.file);

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const uploadedUrls = await uploadImagesToCloudinary(filesToUpload);
      const response = await fetch(`${API_BASE_URL}/gallery/create-gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          galleryImages: uploadedUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save images to backend.");
      }

      // setUploadSuccess('Images uploaded and saved successfully!');
      toast.success("Images uploaded and saved successfully!");
    } catch (error) {
      console.error("Image upload failed in component:", error);
      setUploadError(error.message || "Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
    setFormError("");
    setFormSuccess("");
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const handleSavec = async (e) => {
    e.preventDefault();
    console.log("handleSavec called");

    setFormLoading1(true);
    setFormSucces("");
    setFormuid("");

    if (!userId) {
      setFormuid("Cannot save role: User information is missing.");
      setFormLoading1(false); // Stop loading
      return;
    }

    const validationErrors = {};
    if (!formData.role) {
      validationErrors.role = "Role is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormLoading1(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/update-role-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            newRole: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user role.");
      }
      setFormSucces("Role saved successfully!");
      setErrors({});
    } catch (error) {
      console.error("Failed to save role:", error);
    } finally {
      setFormLoading1(false);
    }
  };

  const handleSaveChangesp = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    if (!userId) {
      setFormuid("Cannot save images: User information is missing.");
      return;
    }
    const validationErrors = {};

    if (!formData.changePassword.trim()) {
      validationErrors.changePassword = "Password is required.";
    } else if (formData.changePassword.length < 6) {
      validationErrors.changePassword =
        "Password must be at least 6 characters long.";
    }

    if (!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.changePassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/update-role-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            newRole: formData.role,
            newPassword: formData.changePassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user.");
      }

      setFormSuccess("Changes saved successfully!");

      setFormData({
        changePassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to save changes:", error);
      setFormError(
        error.message || "Failed to save changes. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };
  const handleRemoveImage = (idToRemove) => {
    setGalleryImages((prevImages) =>
      prevImages.filter((image) => image.id !== idToRemove)
    );
    if (galleryImages.length === 1) {
      setUploadError("");
      setUploadSuccess("");
    }
  };

  // Deletion for Image or Account
  // const confirmAction = (type, index = null) => {
  // 	setModalType(type);
  // 	if (type === 'image') {
  // 		setSelectedImageIndex(index);
  // 	}
  // 	setOpenModal(true);
  // };

  const confirmDelImage = (index) => {
    setSelectedImageIndex(index);
    setOpenModal(true);
  };

  const handleImageDelete = async () => {
    if (!userId) {
      toast.error("User info missing.");
      return;
    }
    setDelLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/delete-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, index: selectedImageIndex }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Image deleted successfully!");
        setGalleryImagesprev((prev) =>
          prev.filter((_, i) => i !== selectedImageIndex)
        );
        setOpenModal(false);
        setModalType(null);
      } else {
        toast.error(data.message || "Image deletion failed.");
      }
    } catch (err) {
      toast.error("Image deletion error.");
      console.log("Image deletion error: ", err);
    } finally {
      setDelLoading(false);
      setOpenModal(false);
      setModalType(null);
    }
  };

  const handleAccountDelete = async () => {
    if (!userId) {
      toast.error("User info missing.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      toast.success("Account deleted successfully.");
      setOpenModal(false);
      setModalType(null);
      router.push("/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      toast.error(`Account deletion failed: ${msg}`);
    } finally {
      setIsLoading(false);
      setOpenModal(false);
      setModalType(null);
    }
  };

  return (
    <div className="w-full h-[60vh] overflow-y-scroll p-4 sm:p-0  ">
      {" "}
      <div className="mb-8 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {" "}
          Add Gallery Images
        </h2>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden shadow-sm relative group"
            >
              <img
                src={image.previewUrl}
                alt={`Gallery preview`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                aria-label="Remove image"
              >
                X
              </button>
            </div>
          ))}
          {galleryImagesprev.map((image, index) => (
            <div
              key={index}
              className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden shadow-sm relative group"
            >
              <img
                src={image.previewUrl}
                alt={`Gallery preview`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedImageIndex(index);
                  setModalType("image");
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                aria-label="Remove image"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddImageClick}
            className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors border border-dashed border-gray-400"
            aria-label="Add gallery image"
            disabled={isUploading}
          >
            <div className="bg-gray-400 h-10 w-10 rounded-full flex justify-center items-center">
              {" "}
              <PlusIcon />
            </div>
          </button>
        </div>

        {/* Shared Delete Confirmation Model - Image or Account deletion */}
        {modalType && (
          <Modal isOpen={!!modalType} onClose={() => setModalType(null)}>
            <div className="sm:p-6 p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {modalType === "image"
                  ? "Are you sure you want to delete this image?"
                  : "Are you sure you want to delete your account? This action cannot be undone."}
              </h3>
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    modalType === "image"
                      ? handleImageDelete
                      : handleAccountDelete
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </Modal>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
          disabled={isUploading}
        />
        {formuid && <p className="text-red-600 text-sm mt-2">{formuid}</p>}
        {uploadError && (
          <p className="text-red-600 text-sm mt-2">{uploadError}</p>
        )}
        {uploadSuccess && (
          <p className="text-green-600 text-sm mt-2">{uploadSuccess}</p>
        )}

        <button
          type="button"
          onClick={handleSaveImages}
          disabled={isUploading || galleryImages.length === 0}
          className={`py-1 font-alice btn cursor-pointer rounded-lg px-3 text-sm  font-medium  min-w-fit justify-center  text-white  flex items-center hover:bg-yellow hover:text-white duration-300 transition-all ${
            isUploading || galleryImages.length === 0
              ? "bg-gray-400 rounded-[14px] text-white font-[500] text-center flex items-center justify-center w-[100px] h-[48px]  hover:bg-[#001f36 cursor-not-allowed"
              : "bg-[#002B4B]  rounded-[14px] text-white font-[500] text-center flex items-center justify-center w-[100px] h-[48px]  hover:bg-[#001f36"
          }`}
        >
          {isUploading ? "Uploading..." : "Save Images"}
        </button>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 mt-6">
        Manage Account
      </h2>
      <form
        onSubmit={handleSavec}
        autoComplete="off"
        className="gap-6 w-full flex flex-col  pb-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 md:gap-x-16 lg:gap-x-40">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="border-b border-gray-300">
              <label htmlFor="role" className={`text-sm mb-1 block `}>
                Role
              </label>
              <div
              // className={`border-b  ${errors.role ? 'border-red-500' : 'border-gray-300'
              // 	} ${focused.role ? 'border-gray-700 ring-1 ring-gray-700' : ''
              // 	}`}
              >
                <Select
                  id="role"
                  name="role"
                  options={roleOptions}
                  value={roleOptions.find(
                    (option) => option.value === formData.role
                  )}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      role: selectedOption ? selectedOption.value : "",
                    });

                    setErrors((prevErrors) => {
                      const { role, ...rest } = prevErrors;
                      return rest;
                    });
                    setFormSucces("");
                  }}
                  onFocus={() => handleFocus("role")}
                  onBlur={() => handleBlur("role")}
                  classNamePrefix="react-select"
                  placeholder="Select role..."
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      border: "none",
                      boxShadow: "none",
                      backgroundColor: "white",

                      borderColor: "transparent",
                      outline: "none",
                      "&:hover": {
                        border: "none",
                      },
                      "&:focus": {
                        border: "none",
                      },
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
                />
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>
          </div>
        </div>

        {formSucces && (
          <p className="text-green-600 text-sm mt-2">{formSucces}</p>
        )}

        {formuid && !formSucces && (
          <p className="text-red-600 text-sm mt-2">{formuid}</p>
        )}

        <button
          type="submit"
          disabled={formLoading1 || !formData.role} // Disable if loading or role not selected
          className={`py-1 font-alice btn cursor-pointer rounded-lg px-3 text-sm  font-medium  min-w-fit justify-center  text-white  flex items-center hover:bg-yellow hover:text-white duration-300 w-[140px] transition-colors ${
            formLoading1 || !formData.role
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#002B4B] rounded-[14px] text-white font-[500] text-center flex items-center justify-center w-[100px] h-[48px] hover:bg-[#001f36]"
          }`}
        >
          {formLoading1 ? "Saving..." : "Save Role"} {/* DISTINCT TEXT */}
        </button>
      </form>
      <form
        onSubmit={handleSaveChangesp}
        autoComplete="off"
        className="gap-6 w-full flex flex-col "
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 md:gap-x-16 lg:gap-x-40 mt-4">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="">
              <label
                htmlFor="changePassword"
                className={`text-sm mb-1 block ${
                  focused.changePassword || formData.changePassword
                    ? "text-gray-600"
                    : "text-gray-600"
                }`}
              >
                Change Password
              </label>
              <div
                className={`relative border-b ${
                  focused.changePassword ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  id="changePassword"
                  name="changePassword"
                  placeholder="New Password "
                  value={formData.changePassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus("changePassword")}
                  onBlur={() => handleBlur("changePassword")}
                  className="w-full py-2 text-sm font-normal text-gray-800 focus:ring-0 focus:outline-none bg-transparent"
                />
                <div
                  className="absolute right-0 top-2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              {errors.changePassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.changePassword}
                </p>
              )}
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="">
              <label
                htmlFor="confirmPassword"
                className={`text-sm mb-1 block ${
                  focused.confirmPassword || formData.confirmPassword
                    ? "text-gray-600"
                    : "text-gray-600"
                }`}
              >
                Confirm Password
              </label>
              <div
                className={`relative border-b ${
                  focused.confirmPassword
                    ? "border-gray-700"
                    : "border-gray-300"
                }`}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  className="w-full py-2 text-sm font-normal text-gray-800 focus:ring-0 focus:outline-none bg-transparent"
                />
                <div
                  className="absolute right-0 top-2 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>
        {formuid && <p className="text-red-600 text-sm mt-2">{formuid}</p>}
        {formError && <p className="text-red-600 text-sm mt-2">{formError}</p>}
        {formSuccess && (
          <p className="text-green-600 text-sm mt-2">{formSuccess}</p>
        )}

        <button
          type="submit"
          disabled={formLoading}
          className={`py-2 font-alice btn cursor-pointer rounded-lg px-3 text-sm  font-medium  min-w-fit justify-center  text-white  flex items-center hover:bg-yellow hover:text-white duration-300 w-[140px] transition-colors ${
            formLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#002B4B]  hover:bg-[#001f36] rounded-[14px] text-white font-[500] text-center flex items-center justify-center w-[100px] h-[48px]  "
          }`}
        >
          {formLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
      <h2 className="text-lg font-semibold text-gray-800 my-6 ">
        Account Deletion
      </h2>
      <button
        onClick={() => setModalType("account")}
        disabled={isLoading}
        className={`py-1 font-alice btn cursor-pointer  px-3 text-sm    min-w-fit  hover:bg-yellow hover:text-white duration-300 rounded-[8px] text-white font-[500] text-center flex items-center justify-center h-[48px] transition-colors bg-red-600  hover:bg-red-700 w-[140px]  ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Deleting..." : "Delete Account"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
    </div>
  );
};

export default Account;
