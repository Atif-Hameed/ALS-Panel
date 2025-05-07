"use client";
import React, { useState, useEffect } from "react";
import CalendarView from "./CalendarView";
import Modal from "../../Components/common/modal";
import AddEvent from "./add-event";
import { API_BASE_URL } from "../../api";
import { BiX } from "react-icons/bi";
import toast from "react-hot-toast";

const Calendar = () => {
  const [addEvent, setAddEvent] = useState(false);
  const [userId, setUserId] = useState(null);
  const [edit, setEdit] = useState(null);
  const [fetchData, setFetchData] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  const handleAddEvent = () => {
    setEdit(null);
    setAddEvent(true);
  };

  const handleEditSuccess = () => {
    setFetchData((prev) => !prev);
    setAddEvent(false);
    setEdit(null);
    toast.success("Event updated successfully!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-[#0A1629] text-[24px] font-bold sm:text-[36px]">
          Calendar
        </h1>
        <button
          onClick={handleAddEvent}
          className="flex cursor-pointer w-[150px] sm:w-[179px] h-[48px] items-center justify-center gap-2 bg-[#002B4B] text-[#FFFFFF] px-4  rounded-lg text-sm font-[700] hover:bg-[#001f35] transition"
        >
          + Add Event
        </button>
      </div>

      <CalendarView
        setEdit={setEdit}
        onClose={() => setAddEvent(true)}
        fetchData={fetchData}
        setFetchData={setFetchData}
        userId={userId}
      />

      <Modal
        isOpen={addEvent}
        onClose={() => {
          setAddEvent(false);
          setEdit(null);
        }}
      >
        <div className="relative">
          <button
            onClick={() => {
              setAddEvent(false);
              setEdit(null);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <BiX size={24} />
          </button>
          <AddEvent
            setFetchData={setFetchData}
            edit={edit}
            onClose={handleEditSuccess}
            userId={userId}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
