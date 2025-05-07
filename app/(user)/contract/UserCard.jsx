
"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import Modal from "../../Components/common/modal";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import UploadPDF from "./UploadPDF";
import { CgProfile } from "react-icons/cg";
import toast from "react-hot-toast";

const EllipsisVerticalIcon = (props) => (
  <svg
    className="text-[#0A1629]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
    />
  </svg>
);

const UserCard = ({
  contract,
  userid,
  setIsState,
  isUser,
  setIsFetch,
  socket,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [addContract, setAddContract] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [localContract, setLocalContract] = useState(contract);
  const [isDeleted, setIsDeleted] = useState(false);

  // Update localContract when parent component's contract prop changes
  useEffect(() => {
    setLocalContract(contract);
  }, [contract]);

  // Listen for socket updates specific to this contract
  useEffect(() => {
    if (!socket) return;

    // Listen for contract status updates
    const handleContractUpdate = (updatedContract) => {
      if (updatedContract._id === localContract._id) {
        setLocalContract(updatedContract);
      }
    };

    // Listen for contract deletions
    const handleContractDelete = (deletedContractId) => {
      if (deletedContractId === localContract._id) {
        setIsDeleted(true);
        // Show a toast notification that the contract was deleted
        toast.info("This contract has been deleted");
      }
    };

    socket.on("contract-status-updated", handleContractUpdate);
    socket.on("contract-deleted", handleContractDelete);

    return () => {
      socket.off("contract-status-updated", handleContractUpdate);
      socket.off("contract-deleted", handleContractDelete);
    };
  }, [socket, localContract._id]);

  // If contract is deleted, don't render
  if (isDeleted) {
    return null;
  }

  const handleAddContract = () => setAddContract(!addContract);
  const displayData = isUser
    ? {
        // Creator view - show recipient info
        name: localContract.name,
        email: localContract.email,
        profileImage: localContract.profileImage,
      }
    : {
        // Recipient view - show creator info
        name: localContract.createdBy?.fullName || "Creator",
        email: localContract.createdBy?.email || "No email",
        profileImage: localContract.createdBy?.profileImage || null,
      };

  const isSameUser = userid === localContract.userId?.toString();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const updateContractStatus = async (status) => {
    setIsState(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/contracts/update-status/${localContract._id}?userId=${userid}`,
        { status }
      );

      // We don't need to manually update state anymore since socket will handle it
      setShowDropdown(false); // Close dropdown after action
      toast.success(`Contract ${status.toLowerCase()}`);
    } catch (error) {
      // Only show error toast if it's not a case of same user viewing their own contract
      if (
        error.response?.status !== 403 ||
        error.response?.data?.message !==
          "You are not allowed to update your own contract status."
      ) {
        toast.error("Failed to update status");
      }
      console.error(error);
    } finally {
      setIsState(false);
    }
  };

  const handleDownload = async (fileType = "original") => {
    try {
      const fileUrl =
        fileType === "original"
          ? localContract.fileUrl
          : localContract.signfileUrl;

      if (!fileUrl) throw new Error("File not available");

      // Open the file in a new tab instead of downloading
      window.open(
        `${API_BASE_URL}/contracts/view/${localContract._id}?userId=${userid}`,
        "_blank"
      );

      // The backend will handle status update and socket emission
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/contracts/delete/${localContract._id}`
      );
      toast.success("Contract deleted");
      setOpenDeleteModal(false);

      // Note: We don't need to manually update UI state here
      // The socket event listener will handle removing this component
    } catch (error) {
      toast.error("Delete failed");
      console.error(error);
    }
  };


  console.log(localContract)

  return (
    <div
      ref={dropdownRef}
      className="flex flex-col md:flex-row relative items-start md:items-center justify-between w-full p-4 bg-[#FFFFFF] rounded-[24px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] gap-4 md:gap-0"
    >
      {/* Profile Section */}
      <div className="flex w-full md:w-[30%] items-center space-x-3">
        <div className="flex-shrink-0">
          {displayData.profileImage ? (
            <Image
              src={displayData.profileImage}
              alt={`${displayData.name}'s profile`}
              width={50}
              height={50}
              className="rounded-full bg-yellow-50"
            />
          ) : (
            <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-yellow-50 text-gray-500 text-2xl">
              <CgProfile />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-bold text-[#0A1629] truncate">
            {displayData.name}
          </div>
          <div className="text-sm text-[#91929E] underline decoration-gray-300 decoration-1 underline-offset-2 truncate">
            {displayData.email}
          </div>
        </div>
      </div>

      {/* Date and Status */}
      <div className="flex flex-row md:flex-row w-full md:w-[60%] gap-4">
        <div className="text-start w-full md:w-[50%]">
          <div className="text-[14px] text-[#000000] font-[400] mb-1">Date</div>
          <div className="text-sm font-[400] text-[#000000]">
            {formatDate(localContract?.date)}
          </div>
        </div>
        <div className="text-start w-full md:w-[50%]">
          <div className="text-[14px] text-[#000000] font-[400] mb-1">
            Status
          </div>
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-[6px] 
              ${
                localContract?.status === "Pending"
                  ? "text-[#FFBD21] bg-yellow-100 border border-[#FFBD21]"
                  : ""
              }
              ${
                localContract?.status === "Viewed"
                  ? "text-[#4CAF50] bg-green-100 border border-[#4CAF50]"
                  : ""
              }
              ${
                localContract?.status === "Rejected"
                  ? "text-[#F44336] bg-red-100 border border-[#F44336]"
                  : ""
              }
              ${
                localContract?.status === "Accepted"
                  ? "text-[#2196F3] bg-blue-100 border border-[#2196F3]"
                  : ""
              }
            `}
          >
            {localContract?.status || "Unknown"}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="absolute right-4 top-4 md:static">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-fit rounded-lg cursor-pointer bg-[#fcae6644] px-1 py-0.5"
          aria-label="More options"
        >
          <BiDotsHorizontalRounded className="text-3xl rotate-90 text-[#FCAE66]" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-[64px] top-12 md:top-0 p-2 mt-2 w-[130px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {/* Always show View Contract option */}
          <button
            className="cursor-pointer w-full mb-1 px-4 py-2 text-center flex justify-center text-xs text-[#5B93FF] bg-[#5b92ff3e] rounded"
            onClick={() => {
              handleDownload("original");
              setShowDropdown(false);
            }}
          >
            View Contract
          </button>

          {/* Sender-specific options */}
          {isUser && (
            <>
              <button
                className="cursor-pointer w-full px-4 py-2 text-center flex justify-center text-xs  text-[#E71D36] bg-[#e71d353c] rounded"
                onClick={() => {
                  setOpenDeleteModal(true);
                  setShowDropdown(false);
                }}
              >
                Delete
              </button>
              {localContract?.status === "Accepted" && (
                <button
                  className="w-full px-4 py-2 text-center flex justify-center text-sm text-blue-500 hover:bg-gray-50"
                  onClick={() => {
                    handleDownload("signed");
                    setShowDropdown(false);
                  }}
                >
                  View Signed
                </button>
              )}
            </>
          )}

          {/* Recipient-specific options */}
          {!isUser && localContract?.status !== "Accepted" && (
            <>
              <button
                className="w-full px-4 py-2 text-center flex justify-center text-sm text-red-500 hover:bg-gray-50"
                onClick={() => updateContractStatus("Rejected")}
              >
                Reject
              </button>
              <button
                className="w-full px-4 py-2 text-center flex justify-center text-sm text-green-500 hover:bg-gray-50"
                onClick={handleAddContract}
              >
                Sign
              </button>
            </>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className="sm:p-6 p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Are you sure you want to delete this contract?
          </h3>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => setOpenDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Signature Upload Modal */}
      <Modal isOpen={addContract} onClose={handleAddContract}>
        <UploadPDF
          id={localContract._id}
          addContract={addContract}
          setAddContrac={setAddContract}
          onSuccess={() => {
            updateContractStatus("Accepted");
            handleAddContract();
          }}
        />
      </Modal>
    </div>
  );
};

export default UserCard;
