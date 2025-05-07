

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "../../api";
import toast from "react-hot-toast";
import Modal from "../../Components/common/modal";
import Button from "../../Components/common/custom-button";

// ChevronDownIcon remains the same
const ChevronDownIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={4}
    stroke="currentColor"
    className={className || "w-[10px] h-[6px] font-bold text-[#0A1629]"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

// Hamburger menu icon for mobile
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const Sidebar = ({
  setHandelPropertyNames,
  setHandelPropertyId,
  setStep,
  isAddress,
  activeSubTab,
}) => {
  const [propertyNames, setPropertyNames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    propertyId: null,
    propertyName: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [siteProperty, setSiteProperty] = useState();

  const pathname = usePathname();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage.");
      setError(
        "User identification is missing. Cannot load or add properties."
      );
    }
  }, []);

  useMemo(() => {
    if (!userId) return;

    const fetchPropertyNames = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/property/get-property-name/${userId}`
        );

        

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const properties = Array.isArray(data?.data)
          ? data.data
          : [];
        setPropertyNames(properties);

        const initialDropdowns = properties.reduce((acc, item) => {
          acc[item.propertyName] = false;
          return acc;
        }, {});
        setOpenDropdowns(initialDropdowns);
      } catch (e) {
        console.error("Failed to fetch property names:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyNames();
  }, [userId, isAddress]);

  const validatePropertyName = (name) => {
    // Remove leading/trailing whitespace
    const trimmedName = name.trim();

    // Check minimum length
    if (trimmedName.length < 3) {
      return "Property name must be at least 3 characters long.";
    }

    // Check maximumLuxury length
    if (trimmedName.length > 100) {
      return "Property name cannot exceed 100 characters.";
    }

    // Allow English letters, numbers, spaces, and specific punctuation (.,-,')
    const validNameRegex = /^[a-zA-Z0-9\s.,'-]+$/;
    if (!validNameRegex.test(trimmedName)) {
      return "Property name can only contain English letters, numbers, spaces, periods, commas, hyphens, and apostrophes.";
    }

    // Check for only period
    if (trimmedName === ".") {
      return "Property name cannot be just a period.";
    }

    return null;
  };

  const handleAddProperty = async () => {
    const trimmedName = newProperty.trim();

    // Validate property name
    const validationResult = validatePropertyName(newProperty);
    if (validationResult) {
      setValidationError(validationResult);
      toast.error(validationResult);
      return;
    }

    if (!userId) {
      setValidationError("Cannot add property: User ID is missing.");
      toast.error("Cannot add property: User ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setValidationError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/property/create-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyName: trimmedName,
          userId: userId,
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) { }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setPropertyNames((prev) => [
        ...prev,
        { propertyName: trimmedName, _id: data.property._id },
      ]);

      setOpenDropdowns((prev) => ({ ...prev, [trimmedName]: true }));
      setNewProperty("");
      setIsModalOpen(false);
      toast.success("Property added successfully!");
    } catch (e) {
      console.error("Failed to add property:", e);
      setError(`Failed to add property: ${e.message}`);
      toast.error(` ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const dropdownItems = [
    { name: "Details & Address" },
    { name: "Uploads" },
    { name: "Features" },
    { name: "Create Site" },
  ];

  const handleDeleteClick = (propertyId, propertyName) => {
    setDeleteModal({
      isOpen: true,
      propertyId,
      propertyName,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      propertyId: null,
      propertyName: "",
    });
  };

  const handleDeleteProperty = async () => {
    const { propertyId } = deleteModal;
    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/property/delete-property/${propertyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPropertyNames((prev) =>
        prev.filter((prop) => prop._id !== propertyId)
      );

      toast.success("Property deleted successfully!");
    } catch (e) {
      console.error("Failed to delete property:", e);
      toast.error("Error deleting property.");
    } finally {
      setDeleting(false);
      handleCloseDeleteModal();
    }
  };

  const handleCreateSite = (item) => {
    setSiteProperty(item)
  }

  console.log(propertyNames)

  return (
    <div className="h-full">
      {/* Mobile menu button */}
      <div className="lg:hidden flex top-20 left-90 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2 bg-[#002B4B] text-white rounded-md ${isMobileMenuOpen ? 'hidden' : 'block'}`}
        >
          <MenuIcon />
        </button>
      </div>

      {/* Add Property Modal */}
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setNewProperty('');
      }}>
        <div className="p-4 text-center">
          <h2 className="text-lg font-bold text-[#0A1629] mb-4">
            Add Property
          </h2>
          <input
            type="text"
            value={newProperty}
            onChange={(e) => {
              setNewProperty(e.target.value);
              setValidationError(null); // Clear validation error on input change
            }}
            className={`w-full text-[#0A1629] placeholder-gray-400 p-2 border rounded-md focus:ring-2 focus:ring-black outline-none ${validationError ? "border-red-500" : ""
              }`}
            placeholder="Enter Property Name"
            disabled={isSubmitting}
          />
          {validationError && (
            <p className="text-red-500 text-sm mt-2">{validationError}</p>
          )}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setNewProperty('');
              }}
              className="cursor-pointer px-4 h-[48px] text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleAddProperty}
              className="cursor-pointer px-6 h-[48px] text-sm font-medium text-white bg-[#002B4B] rounded-lg hover:bg-[#00395f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !newProperty.trim()}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.isOpen} onClose={handleCloseDeleteModal}>
        <div className="sm:p-6 p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Are you sure you want to delete this property?
          </h3>
          <p className="text-gray-600 mb-4">
            Property: "{deleteModal.propertyName}"
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={handleCloseDeleteModal}
              className="px-4 h-[48px] text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProperty}
              className="px-4 h-[48px] text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[265px] h-full overflow-auto bg-white p-4  rounded-[24px] border-none  flex-col space-y-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#002B4B] cursor-pointer w-full  text-white px-4 h-[48px] rounded-lg text-sm font-semibold hover:bg-[#1a2f4f] transition-colors"
          disabled={!userId}
        >
          + Add Property
        </button>

        {isLoading && (
          <p className="text-center text-gray-500">Loading properties...</p>
        )}
        {/* {error && (
          <p className="text-center text-red-500 px-2 text-sm">{error}</p>
        )} */}

        {!isLoading && !error && propertyNames.length === 0 && (
          <p className="text-center text-gray-500 text-sm px-2">
            No properties added yet. Click '+ Add Property' to start.
          </p>
        )}

        {!isLoading &&
          propertyNames.map((property) => {
            const { propertyName, _id, originalPropertyId } = property;

            return (
              <div key={_id}>
                <div
                  className="bg-[#F4F9FD] hover:bg-[#eaf4fc] p-3 rounded-[14px] flex items-center justify-between cursor-pointer mt-2"
                  onClick={() => toggleDropdown(propertyName)}
                  role="button"
                  aria-expanded={openDropdowns[propertyName]}
                  aria-controls={`dropdown-${propertyName}`}
                >
                  <span className="font-[700] text-[16px] text-[#0A1629]">
                    {propertyName}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${openDropdowns[propertyName] ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </div>

                {openDropdowns[propertyName] && (
                  <div
                    id={`dropdown-${propertyName}`}
                    className="flex flex-col space-y-1 mt-1 pl-2"
                  >
                    {dropdownItems.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (item.name === "Details & Address") {
                            setHandelPropertyNames(property);
                          } else if (item.name === "Create Site") {
                            handleCreateSite(property)
                          }
                          else {
                            setHandelPropertyNames(propertyName);
                          }
                          setHandelPropertyId(originalPropertyId ? originalPropertyId : _id);
                          setStep(`${item.name}-${originalPropertyId ? originalPropertyId : _id}`);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`block py-2 px-3 cursor-pointer rounded-[14px] text-[15px] transition-colors font-[400] ${activeSubTab === item.name
                          ? "bg-[#eaf4fc] text-black font-medium"
                          : "text-[#002B4B] hover:bg-[#eaf4fc]"
                          }`}
                      >
                        {item.name}
                      </div>
                    ))}

                    <button
                      onClick={() => handleDeleteClick(_id, propertyName)}
                      className="text-red-600 mt-2 px-3 py-1 text-left text-[14px] hover:bg-red-100 rounded-[14px] transition"
                    >
                      Delete Property
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute left-3 inset-0 z-30">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar Content */}
          <div className="relative z-40 w-[280px] h-full bg-white p-4 overflow-y-auto">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#002B4B] text-white py-2 rounded-[12px] text-sm font-semibold hover:bg-[#1a2f4f] transition-colors w-full mb-4"
              disabled={!userId}
            >
              + Add Property
            </Button>

            {isLoading && (
              <p className="text-center text-gray-500">Loading properties...</p>
            )}
            {error && (
              <p className="text-center text-red-500 px-2 text-sm">{error}</p>
            )}

            {!isLoading && !error && propertyNames.length === 0 && (
              <p className="text-center text-gray-500 text-sm px-2">
                No properties added yet. Click '+ Add Property' to start.
              </p>
            )}

            {!isLoading &&
              propertyNames.map((property) => {
                const { propertyName, _id } = property;

                return (
                  <div key={_id}>
                    <div
                      className="bg-[#F4F9FD] hover:bg-[#eaf4fc] p-3 rounded-[14px] flex items-center justify-between cursor-pointer mt-2"
                      onClick={() => toggleDropdown(propertyName)}
                      role="button"
                      aria-expanded={openDropdowns[propertyName]}
                      aria-controls={`dropdown-${propertyName}`}
                    >
                      <span className="font-[700] text-[16px] text-[#0A1629]">
                        {propertyName}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${openDropdowns[propertyName]
                          ? "rotate-180"
                          : "rotate-0"
                          }`}
                      />
                    </div>

                    {openDropdowns[propertyName] && (
                      <div
                        id={`dropdown-${propertyName}`}
                        className="flex flex-col space-y-1 mt-1 pl-2"
                      >
                        {dropdownItems.map((item) => (
                          <div
                            key={item.name}
                            onClick={() => {
                              if (item.name === "Details & Address") {
                                setHandelPropertyNames(property);
                              } else if (item.name === "Create Site") {
                                handleCreateSite(property)
                              }
                              else {
                                setHandelPropertyNames(propertyName);
                              }
                              setHandelPropertyId(_id);
                              setStep(`${item.name}-${_id}`);
                              setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
                            }}
                            className={`block py-2 px-3 cursor-pointer rounded-[14px] text-[#002B4B] hover:bg-[#eaf4fc] text-[15px] transition-colors font-[400] ${activeSubTab === item.name
                              ? "bg-[#eaf4fc] text-black font-medium"
                              : ""
                              }`}
                          >
                            {item.name}
                          </div>
                        ))}

                        <button
                          onClick={() => handleDeleteClick(_id, propertyName)}
                          className="text-red-600 mt-2 px-3 py-1 text-left text-[14px] hover:bg-red-100 rounded-[14px] transition"
                        >
                          Delete Property
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
