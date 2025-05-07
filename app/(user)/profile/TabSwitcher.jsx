'use client'
import { useState } from "react";

const TabSwitcher = ({ activeTab, setActiveTab, tabs, parentStyle, allowChange = true,containerStyle }) => {

  const handleTabChange = (tab) => {
    if (allowChange) {
      setActiveTab(tab)
    }
  }

  return (
    <div className={`flex sm:w-fit w-full items-center mt-4 ${containerStyle}`}>
      <div className={`bg-[#E6EDF5] sm:rounded-full rounded-xl overflow-x-scroll scroll-containerb w-full flex sm:flex-row flex-wrap justify-between gap-2 px-2 py-1.5 ${parentStyle}`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 h-[36px] text-sm sm:w-auto w-[45%] rounded-full transition-all duration-300 ${activeTab === tab
              ? "bg-[#002B4B] cursor-pointer text-white shadow-md"
              : "text-black cursor-pointer hover:text-white hover:bg-[#004372]"
              }`}
            disabled={!allowChange}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabSwitcher;
