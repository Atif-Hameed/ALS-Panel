"use client";
import React, { useEffect, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { deleteTeam, getTeamById } from "../../actions/team.action";
import Modal from "../../Components/common/modal";
import toast from "react-hot-toast";

const TeamTable = ({ loading, data, userId, fetchTeams, setSelectedTeam }) => {
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Ensure data is an array
  const validData = Array.isArray(data) ? data : [];

  // Calculate the range of items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = validData.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleOpenDeleteModal = (teamId) => {
    setSelectedTeamId(teamId);
    setOpenModal(true);
    setOpenPopupIndex(null); // Close the popup when modal opens
  };

  const handleCloseDeleteModal = () => {
    setOpenModal(false);
    setSelectedTeamId(null);
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeamId) return;

    try {
      setDeleting(true);
      const { data, error } = await deleteTeam(selectedTeamId);
      if (error) {
        toast.error(error);
        setDeleting(false);
        return;
      }
      console.log(data);
      toast.success("Team deleted successfully");
      fetchTeams(userId); // Refresh the team list
      setDeleting(false);
    } catch (error) {
      toast.error("Failed to delete team");
      console.error(error);
      setDeleting(false);
    } finally {
      handleCloseDeleteModal();
      setDeleting(false);
    }
  };

  const handleEdit = async (teamId) => {
    try {
      const { data, error } = await getTeamById(teamId);
      if (error) {
        console.log(error);
        toast.error(error);
      }
      if (data) {
        console.log(data);
        setSelectedTeam(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error || "Internal server error!");
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

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="overflow-x-auto mt-10 w-full">
      <table className="min-w-full bg-white rounded-xl border border-border p-2">
        <thead className="bg-cgreen rounded-xl">
          <tr className="border-b border-border rounded-t-xl bg-cgreen text-black">
            <th className="p-4 text-start text-sm whitespace-nowrap">#</th>
            <th className="p-4 text-start text-sm whitespace-nowrap">
              Company Name
            </th>
            <th className="p-4 text-start text-sm whitespace-nowrap">City</th>
            <th className="p-4 text-start text-sm whitespace-nowrap">State</th>
            <th className="p-4 text-start text-sm whitespace-nowrap">Agents</th>
            <th className="p-4 text-start text-sm whitespace-nowrap">
              Address
            </th>
            <th className="p-4 text-start text-sm whitespace-nowrap">Unit</th>
            <th className="p-4 text-start text-sm whitespace-nowrap">
              Zip Code
            </th>
            <th className="p-4 text-start rounded-tr-xl text-sm whitespace-nowrap">
              Website
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
                colSpan={10}
                className="text-center py-8 text-gray-500 font-semibold"
              >
                Loading...
              </td>
            </tr>
          ) : currentItems.length > 0 ? (
            currentItems.map((team, i) => (
              <tr
                key={i}
                className={`${
                  i < currentItems.length - 1 ? "border-b-2" : "border-none"
                } border-border text-gray`}
              >
                <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm gap-2">
                  {i + 1 + indexOfFirstItem}
                </td>
                <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm gap-2">
                  {team.basicInfo.name}
                </td>
                <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm text-start">
                  {team.basicInfo.city || "-"}
                </td>
                <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm text-start">
                  {team.basicInfo.state || "-"}
                </td>
                <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm text-start">
                  {team.agents.length || "-"}
                </td>
                <td className="px-4 sm:pr-4 pr-6 py-3 max-w-[250px]  whitespace-wrap text-sm text-start">
                  {team.basicInfo.address || "-"}
                </td>
                <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm text-start">
                  {team.basicInfo.unit || "-"}
                </td>
                <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm text-start">
                  {team.basicInfo.zipCode || "-"}
                </td>
                <td
                  className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm text-start"
                  title={team.basicInfo.website || "-"}
                >
                  {team.basicInfo.website
                    ? team.basicInfo.website.length > 15
                      ? `${team.basicInfo.website.slice(0, 15)}...`
                      : team.basicInfo.website
                    : "-"}
                </td>
                <td className="px-4 sm:pr-4 pr-6 py-3 whitespace-nowrap text-sm flex justify-center text-start relative">
                  <button
                    className="w-fit rounded-lg cursor-pointer bg-[#fcae6644] px-1 py-0.5"
                    onClick={() => togglePopup(i)}
                  >
                    <BiDotsHorizontalRounded className="text-3xl rotate-90 text-[#FCAE66]" />
                  </button>
                  {openPopupIndex === i && (
                    <div
                      className={`absolute ${
                        currentItems.length === i + 1 ||
                        currentItems.length === i + 2
                          ? "bottom-2"
                          : "top-5"
                      } right-15 mt-2 bg-white text-sm rounded-lg shadow-lg space-y-1.5 z-10 p-2 popup-content`}
                    >
                      <button
                        onClick={() => handleEdit(team._id)}
                        className="cursor-pointer flex items-center gap-2 w-full px-2 py-1.5 rounded text-[#5B93FF] bg-[#5b92ff3e]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(team._id)}
                        className="cursor-pointer flex items-center gap-2 w-full px-2 py-1.5 rounded text-[#E71D36] bg-[#e71d353c]"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-8  text-gray-500">
                No Team found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {validData.length > itemsPerPage && (
        <div className="flex items-center justify-start mt-4">
          <div className="flex items-center justify-start mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="mx-4 text-gray-700">{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={indexOfLastItem >= validData.length}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={openModal} onClose={handleCloseDeleteModal}>
        <div className="sm:p-6 p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Are you sure you want to delete this team?
          </h3>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={handleCloseDeleteModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTeam}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamTable;
