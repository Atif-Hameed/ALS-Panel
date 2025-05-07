'use client'

import Modal from "../../Components/common/modal";
import { useState } from "react";
import { BiX } from "react-icons/bi";
import AddContract from "./add-contract";

const ContractsHeader = ({ userId, activeTab, setActiveTab, setIsState }) => {
  const [addContract, setAddContract] = useState(false);

  const handleAddContract = () => {
    setAddContract(!addContract);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full px-4 md:px-0">

      {/* Title */}
      <h1 className="text-[#0A1629] font-bold text-[28px] sm:text-[32px] md:text-[36px]">
        Contracts
      </h1>

      {/* Tabs */}
      <div className="w-full sm:w-auto">
        <div className="flex bg-[#E6EDF5] w-full sm:w-[310px] px-2 py-1 rounded-full">
          {["Pending", "Signed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-1/2 h-[40px] rounded-full text-sm font-medium transition-all ${activeTab === tab
                  ? "bg-[#002B4B] text-[#FFFFFF] text-[16px] font-[700]"
                  : "text-[#0A1629] font-[400] text-[16px]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Add Contract Button */}
      <div className="w-full sm:w-auto">
        <button
          onClick={handleAddContract}
          className="w-full sm:w-[190px] h-[48px] flex items-center justify-center gap-2 bg-[#002B4B] text-[#FFFFFF] px-4 rounded-lg text-sm font-semibold hover:bg-[#001f35] transition"
        >
          + Add Contract
        </button>
      </div>
 
      {/* Modal */}
      <Modal isOpen={addContract} onClose={handleAddContract}>
        <div className="relative p-6 sm:mx-4 mx-2">
          <button
            onClick={handleAddContract}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            aria-label="Close modal"
          >
            <BiX className="text-2xl" />
          </button>
          <AddContract setIsState={setIsState} userId={userId} closeModal={handleAddContract} />
        </div>
      </Modal>

    </div>
  );
};

export default ContractsHeader;
