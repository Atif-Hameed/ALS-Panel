"use client";
import React, { useEffect, useState } from "react";
import { BiDotsHorizontalRounded, BiX } from "react-icons/bi";
import Modal from "../../Components/common/modal";
import Button from "../../Components/common/custom-button";
import AddReferal from "./add-referal";
import AddProperty from "./add-property";
import Pagination from "../../Components/common/pagination";
import toast from "react-hot-toast";
import { removeReferalbyId } from "../../actions/agent.action";
import { useRouter } from "next/navigation";

const ReferalTable = ({
  data,
  meta,
  setPage,
  userId,
  setLimit,
  loading,
  fetchReferalData,
}) => {
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [addReferal, setAddReferal] = useState(false);
  const [addProperty, setAddProperty] = useState(false);
  const [selectedReferalId, setSelectedReferalId] = useState(null);
  const [referalUserId, setReferalUserId] = useState(null);
  const router = useRouter();

  const handleAddReferal = () => {
    setAddReferal((prev) => !prev);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".popup-content")) {
      setOpenPopupIndex(null);
    }
  };

  const togglePopup = (index) => {
    if (openPopupIndex === index) {
      setOpenPopupIndex(null);
    } else {
      setOpenPopupIndex(index);
    }
  };

  const handleOpenDeleteModal = (referalId) => {
    setSelectedReferalId(referalId);
    setOpenModal(true);
  };

  const handleView = (referalId) => {
    if (referalId) {
      router.push(`/view-referal?id=${referalId}`);
    } else {
      toast.error("Referal is not Active user!");
    }
  };

  const handleAddProperty = (referalId) => {
    if (!referalId) {
      toast.error("Referal is not Active user!");
    }
    if (referalId) {
      setAddProperty(true);
      setReferalUserId(referalId);
    }
  };

  const handleCloseAddProperty = () => {
    setAddProperty(false);
    setReferalUserId(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenModal(false);
    setSelectedReferalId(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const removeReferal = async (id) => {
    try {
      const res = await removeReferalbyId(id);
      toast.success("Deleted Successfully!");
      fetchReferalData();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (openPopupIndex !== null) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openPopupIndex]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-[#0A1629] font-[700] text-[24px] sm:text-[36px]">
          Referrals
        </div>
        <Button
          onClick={handleAddReferal}
          label="+ Add Referral"
          className="flex cursor-pointer w-[150px]  sm:w-[179px] h-[48px] items-center justify-center gap-2 bg-[#002B4B] text-[#FFFFFF] px-4 rounded-lg text-sm font-semibold  hover:bg-[#001f35] transition"
        />
      </div>

      <div className="overflow-x-auto mt-10">
        <table className="min-w-full bg-white rounded-xl border border-border p-2">
          <thead className="bg-cgreen rounded-xl">
            <tr className="border-b border-border rounded-t-xl bg-cgreen text-black">
              <th className="p-4 text-start text-sm whitespace-nowrap">#</th>
              <th className="p-4 text-start text-sm whitespace-nowrap">
                Referral Name
              </th>
              <th className="p-4 text-start text-sm whitespace-nowrap">
                Email
              </th>
              <th className="p-4 text-start text-sm whitespace-nowrap">
                Title
              </th>
              <th className="p-4 text-start text-sm whitespace-nowrap">
                Status
              </th>
              <th className="p-4 text-start rounded-tr-xl text-sm whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-500 font-semibold"
                >
                  Loading...
                </td>
              </tr>
            ) : data && data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-500 font-semibold"
                >
                  No referrals found.
                </td>
              </tr>
            ) : (
              data &&
              data.map((referral, i) => (
                <tr
                  key={referral._id}
                  className={`${
                    i < data.length - 1 ? "border-b-2" : "border-none"
                  } border-border text-gray`}
                >
                  <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm gap-2">
                    {(meta.currentPage - 1) * meta.itemsPerPage + i + 1}
                  </td>
                  <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm gap-2">
                    {referral.name}
                  </td>
                  <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm text-start">
                    {referral.email || "-"}
                  </td>
                  <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm text-start">
                    {referral.title || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div
                      className={`w-[90%] sm:w-[60%] px-3 py-1 rounded-md text-center ${
                        referral.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : referral.status === "INVITED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {referral.status}
                    </div>
                  </td>
                  <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm flex justify-left text-start relative">
                    <button
                      className="w-fit rounded-lg cursor-pointer bg-[#fcae6644] px-1 py-0.5"
                      onClick={() => togglePopup(i)}
                    >
                      <BiDotsHorizontalRounded className="text-3xl rotate-90 text-[#FCAE66]" />
                    </button>
                    {openPopupIndex === i && (
                      <div
                        className={`absolute ${
                          data.length === i + 1 || data.length === i + 2
                            ? "bottom-2"
                            : "top-5"
                        } right-20 sm:right-28 mt-2 bg-white text-sm rounded-lg shadow-lg space-y-1.5 z-10 p-2 popup-content`}
                      >
                        <button
                          onClick={() => handleView(referral._id)}
                          className="cursor-pointer flex items-center text-xs gap-2 w-full px-2 py-1 rounded text-[#5B93FF] bg-[#5b92ff3e]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleAddProperty(referral.userId)}
                          className="cursor-pointer flex items-center text-xs gap-2 w-full px-2 py-1 rounded text-[#26be51] bg-[#54d87948]"
                        >
                          Add Property
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(referral._id)}
                          className="cursor-pointer flex items-center text-xs gap-2 w-full px-2 py-1 rounded text-[#E71D36] bg-[#e71d353c]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {meta?.totalPages > 1 && (
          <div className="flex items-center justify-center mt-4">
            <Pagination
              totalPages={meta.totalPages}
              currentPage={meta.currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        )}

        {/* Delete Modal */}
        {openModal && (
          <Modal isOpen={openModal} onClose={handleCloseDeleteModal}>
            <div className="sm:p-6 p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Are you sure you want to remove this referral?
              </h3>
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    removeReferal(selectedReferalId);
                    handleCloseDeleteModal();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Confirm Remove
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add Referral Modal with close button */}
        <Modal isOpen={addReferal} onClose={handleAddReferal}>
          <div className="relative p-6">
            <button
              onClick={handleAddReferal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              aria-label="Close modal"
            >
              <BiX className="text-2xl" />
            </button>
            <AddReferal
              handleAddReferal={handleAddReferal}
              fetchReferalData={fetchReferalData}
            />
          </div>
        </Modal>

        {/* Add Property Modal */}
        <Modal isOpen={addProperty} onClose={handleCloseAddProperty}>
          <div className="relative p-6">
            <button
              onClick={handleCloseAddProperty}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              aria-label="Close modal"
            >
              <BiX className="text-2xl" />
            </button>
            <AddProperty
              userId={userId}
              referalUserId={referalUserId}
              handleCloseAddProperty={handleCloseAddProperty}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ReferalTable;
