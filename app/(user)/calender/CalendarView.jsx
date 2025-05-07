// import React, { useState, useMemo, useEffect, useRef } from "react";
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   startOfWeek,
//   endOfWeek,
//   addDays,
//   addMonths,
//   subMonths,
//   isSameMonth,
//   getDate,
//   // getDay, // getDay wasn't used
//   isToday,
// } from "date-fns";
// import { API_BASE_URL } from "../../api";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

// const getBorderColor = (itemType, statusOrColor) => {
//   if (itemType === "event") {
//     switch (statusOrColor) {
//       case "fuchsia":
//         return "border-fuchsia-400";
//       case "blue":
//         return "border-blue-400";
//       case "purple":
//         return "border-purple-400";
//       default:
//         return "border-gray-400";
//     }
//   } else if (itemType === "contract") {
//     switch (statusOrColor) {
//       case "Accepted":
//         return "border-green-400";
//       case "Pending":
//         return "border-yellow-400";
//       default:
//         return "border-gray-400";
//     }
//   }
//   return "border-gray-400";
// };

// const getBackgroundColor = (itemType, statusOrColor) => {
//   if (itemType === "event") {
//     switch (statusOrColor) {
//       case "fuchsia":
//         return "bg-fuchsia-50";
//       case "blue":
//         return "bg-blue-50";
//       case "purple":
//         return "bg-purple-50";
//       default:
//         return "bg-gray-50";
//     }
//   } else if (itemType === "contract") {
//     switch (statusOrColor) {
//       case "Accepted":
//         return "bg-green-50";
//       case "Pending":
//         return "bg-yellow-50";

//       default:
//         return "bg-gray-50";
//     }
//   }
//   return "bg-gray-50";
// };

// function CalendarView7Col({ userId, fetchData, setEdit, onClose }) {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [events, setEvents] = useState([]);
//   const [events1, setEvents1] = useState([]);
//   const [contracts, setContracts] = useState([]);
//   const [selectedEventId, setSelectedEventId] = useState(null);
//   // const [allEvents, setAllEvents] = useState([]); // This state wasn't used
//   const [userEmail, setUserEmail] = useState(null);
//   const [contractId, setContractId] = useState(null);

//   const popupRef = useRef(null);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [eventToDelete, setEventToDelete] = useState(null);
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedEmail = localStorage.getItem("useremail");
//       setUserEmail(storedEmail);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchContractByEmail = async () => {
//       if (!userEmail) return;
//       try {
//         const res = await axios.get(
//           `${API_BASE_URL}/contracts/by-email/${userEmail}`
//         );

//         if (res.status === 200 && Array.isArray(res.data)) {
//           setContracts(res.data);
//         } else if (res.status === 200 && res.data.contract) {
//           setContracts([res.data.contract]);
//         } else {
//           setContracts([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch contract by email:", error);
//         setContracts([]);
//       }
//     };

//     fetchContractByEmail();
//   }, [userEmail]);

//   useEffect(() => {
//     const fetchContractsByUserId = async () => {
//       if (!userId || (contracts.length > 0 && userEmail)) return;

//       try {
//         const res = await axios.get(
//           `${API_BASE_URL}/contracts/get-contracts/${userId}`
//         );
//         if (res.status === 200 && Array.isArray(res.data)) {
//           setContracts(res.data);
//         } else {
//           console.warn(
//             "Unexpected response format or status fetching contracts by user ID:",
//             res
//           );
//         }
//       } catch (error) {
//         console.error("Failed to fetch contracts by user ID:", error);
//       }
//     };

//     fetchContractsByUserId();
//   }, [userId, userEmail]);

//   useEffect(() => {
//     const fetchContractById = async () => {
//       if (!contractId) return;
//       try {
//         const res = await axios.get(
//           `${API_BASE_URL}/contracts/get-contract-by-id?id=${contractId}`
//         );

//         if (res.status === 200 && res.data) {
//           setContracts([res.data]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch contract by ID:", error);
//       }
//     };

//     fetchContractById();
//   }, [contractId]);

//   useEffect(() => {
//     const fetchEventsById = async () => {
//       if (!userId) {
//         setEvents([]);
//         return;
//       }
//       try {
//         const response = await fetch(`${API_BASE_URL}/calender/get/${userId}`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setEvents(data.events || []);
//       } catch (error) {
//         console.error("Error fetching calendar events by ID:", error);
//         setEvents([]);
//       }
//     };
//     fetchEventsById();
//   }, [userId, fetchData]);

//   useEffect(() => {
//     const fetchEventsByEmail = async () => {
//       const email = localStorage.getItem("useremail");
//       if (!email) {
//         console.log("Email not found in localStorage for fetching events");
//         setEvents1([]);
//         return;
//       }

//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/calender/get-by-email/${email}`
//         );
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         const data = await res.json();
//         if (data.events) {
//           setEvents1(data.events);
//         } else {
//           console.log(data.message || "No events found for email");
//           setEvents1([]);
//         }
//       } catch (err) {
//         console.error("Error fetching calendar events by email:", err);
//         setEvents1([]);
//       }
//     };
//     fetchEventsByEmail();
//   }, []);

//   const monthName = format(currentDate, "MMMM, yyyy");
//   const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   const daysInGrid = useMemo(() => {
//     const monthStart = startOfMonth(currentDate);
//     const monthEnd = endOfMonth(currentDate);
//     const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
//     const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

//     const gridCells = [];
//     let dayCursor = startDate;

//     while (dayCursor <= endDate) {
//       const dayOfMonth = getDate(dayCursor);
//       const isCurrent = isSameMonth(dayCursor, currentDate);
//       const isTodaysDate = isToday(dayCursor);
//       const formattedCursorDate = format(dayCursor, "yyyy-MM-dd");

//       const relevantEventsSource =
//         events1 && events1.length > 0 ? events1 : events;
//       const filteredEvents = (relevantEventsSource || []).filter((ev) => {
//         if (!ev || !ev.date) return false;
//         try {
//           return (
//             format(new Date(ev.date), "yyyy-MM-dd") === formattedCursorDate
//           );
//         } catch (e) {
//           console.error("Error parsing event date:", ev.date, e);
//           return false;
//         }
//       });

//       const mappedEvents = filteredEvents.map((ev) => ({
//         id: ev._id,
//         type: "event",
//         title: ev.eventName,
//         email: ev.email,
//         eventName: ev.eventName,
//         referralName: ev.referralName,
//         subtitle: ev.referralName,
//         date: format(new Date(ev.date), "dd MMM yy"),
//         status: ev.status,
//         color:
//           ev.status === "Open"
//             ? "blue"
//             : ev.status === "Sent"
//             ? "purple"
//             : "fuchsia",

//         originalEvent: ev,
//       }));

//       const filteredContracts = (contracts || []).filter((contract) => {
//         if (!contract || !contract.date) return false;
//         try {
//           return (
//             format(new Date(contract.date), "yyyy-MM-dd") ===
//             formattedCursorDate
//           );
//         } catch (e) {
//           console.error("Error parsing contract date:", contract.date, e);
//           return false;
//         }
//       });

//       const mappedContracts = filteredContracts.map((contract) => ({
//         id: contract._id,
//         type: "contract",
//         title: contract.name,
//         subtitle: `Contract ${contract.status}`,
//         date: format(new Date(contract.date), "dd MMM yy"),
//         status: contract.status,

//         originalContract: contract,
//       }));

//       gridCells.push({
//         day: dayOfMonth,
//         isCurrentMonth: isCurrent,
//         isToday: isTodaysDate,
//         items: [...mappedEvents, ...mappedContracts],
//         fullDate: dayCursor,
//       });

//       dayCursor = addDays(dayCursor, 1);
//     }

//     return gridCells;
//   }, [currentDate, events, events1, contracts]);

//   const goToPreviousMonth = () => {
//     setCurrentDate((current) => subMonths(current, 1));
//   };

//   const goToNextMonth = () => {
//     setCurrentDate((current) => addMonths(current, 1));
//   };

//   const deleteEvent = async (eventId) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/calender/calendar-event-delete/${eventId}`,
//         { method: "DELETE" }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setEvents((prev) => prev.filter((event) => event._id !== eventId));
//         setEvents1((prev) => prev.filter((event) => event._id !== eventId));
//         toast.success("Event Deleted successfully!");
//         setSelectedEventId(null);
//       } else {
//         alert(data.message || "Failed to delete event");
//       }
//     } catch (error) {
//       console.error("Error deleting calendar event:", error);
//       alert("Something went wrong while deleting the event");
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setSelectedEventId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="mt-5">
//       <div className="bg-white rounded-2xl p-3 md:p-6">
//         {/* Month Navigation */}
//         <div className="flex justify-center gap-4 items-center mb-4 px-2">
//           <button
//             onClick={goToPreviousMonth}
//             className="text-blue-500 hover:text-blue-700 p-2 disabled:text-gray-300 rounded-full hover:bg-blue-50 transition-colors"
//             aria-label="Previous month"
//           >
//             <FaArrowLeftLong size={18} />
//           </button>
//           <h2 className="text-lg md:text-xl font-semibold text-gray-700 w-36 text-center">
//             {monthName}
//           </h2>
//           <button
//             onClick={goToNextMonth}
//             className="text-blue-500 hover:text-blue-700 p-2 disabled:text-gray-300 rounded-full hover:bg-blue-50 transition-colors"
//             aria-label="Next month"
//           >
//             <FaArrowRightLong size={18} />
//           </button>
//         </div>

//         {/* Calendar Grid */}
//         <div className="grid grid-cols-7 border-t border-l border-gray-200 text-xs md:text-sm">
//           {/* Weekday Headers - Smaller on mobile */}
//           {weekdays.map((weekday) => (
//             <div
//               key={weekday}
//               className="relative border-b border-r border-gray-200 py-2 px-0.5 md:px-2 text-center bg-gray-50"
//             >
//               <span className="text-[10px] md:text-xs font-medium text-gray-600">
//                 {weekday.substring(0, 3)}{" "}
//                 {/* Show abbreviated names on mobile */}
//               </span>
//             </div>
//           ))}

//           {/* Day Cells - Adjusted for mobile */}
//           {daysInGrid?.map((dayInfo) => (
//             <div
//               key={dayInfo.fullDate.toISOString()}
//               className={`relative border-b border-r border-gray-200 min-h-[80px] md:min-h-[140px] p-1 md:p-2 overflow-hidden ${
//                 dayInfo.isCurrentMonth ? "bg-white" : "bg-gray-50"
//               }`}
//             >
//               {/* Day Number - Better mobile visibility */}
//               <span
//                 className={`absolute top-1 right-1 text-xs md:text-sm font-medium flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full ${
//                   dayInfo.isToday
//                     ? "bg-blue-500 text-white"
//                     : dayInfo.isCurrentMonth
//                     ? "text-gray-700"
//                     : "text-gray-300"
//                 }`}
//               >
//                 {dayInfo.day}
//               </span>

//               {/* Items Container - Adjusted spacing for mobile */}
//               <div className="mt-6 md:mt-8 space-y-1">
//                 {dayInfo?.items?.map((item) => (
//                   <div key={`${item.type}-${item.id}`}>
//                     {/* Event Rendering - Mobile optimized */}
//                     {item.type === "event" && (
//                       <div
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedEventId(
//                             item.id === selectedEventId ? null : item.id
//                           );
//                         }}
//                         className={`cursor-pointer rounded-md text-[9px] md:text-xs leading-tight p-1 border-l-4 ${getBorderColor(
//                           item.type,
//                           item.color
//                         )} ${getBackgroundColor(item.type, item.color)}`}
//                       >
//                         {/* Event Popup - Responsive sizing */}
//                         {selectedEventId === item.id && (
//                           <div
//                             ref={popupRef}
//                             className="fixed inset-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-white shadow-lg md:shadow-2xl rounded-lg md:rounded-2xl w-full h-full md:w-[300px] md:h-[150px] md:max-w-[90vw] flex flex-col gap-3 text-sm p-4 justify-center items-center md:items-start"
//                           >
//                             <button
//                               className="absolute top-3 right-3 bg-gray-100 p-1 rounded-full cursor-pointer"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedEventId(null);
//                               }}
//                             >
//                               ✕
//                             </button>
//                             <h3 className="font-bold text-center md:text-left">
//                               {item.title}
//                             </h3>
//                             <div className="flex gap-2 w-full justify-center md:justify-start">
//                               <button
//                                 className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs md:text-sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setEdit({
//                                     ...item.originalEvent,
//                                     _id: item.id, // Make sure to use _id instead of id
//                                   });
//                                   onClose();
//                                   setSelectedEventId(null);
//                                 }}
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs md:text-sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setEventToDelete(item.id);
//                                   setShowDeleteModal(true);
//                                 }}
//                               >
//                                 Delete
//                               </button>
//                               {showDeleteModal && (
//                                 <div className="fixed inset-0 bg-grey bg-opacity-50 flex items-center justify-center z-50">
//                                   <div className="bg-white p-6 rounded-lg max-w-sm w-full">
//                                     <p className="mb-4">
//                                       Are you sure you want to delete this
//                                       event?
//                                     </p>
//                                     <div className="flex justify-end gap-3">
//                                       <button
//                                         className="px-4 py-2 text-gray-700"
//                                         onClick={() =>
//                                           setShowDeleteModal(false)
//                                         }
//                                       >
//                                         Cancel
//                                       </button>
//                                       <button
//                                         className="px-4 py-2 bg-red-600 text-white rounded"
//                                         onClick={() => {
//                                           deleteEvent(eventToDelete);
//                                           setShowDeleteModal(false);
//                                         }}
//                                       >
//                                         Delete
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {/* Event Content - Mobile optimized */}
//                         <div className="flex justify-between items-start gap-1 overflow-hidden">
//                           <div className="truncate">
//                             <p className="font-semibold text-gray-800 truncate">
//                               {item.title}
//                             </p>
//                             {item.subtitle && (
//                               <p className="text-gray-500 text-[8px] md:text-[10px] truncate">
//                                 {item.subtitle}
//                               </p>
//                             )}
//                           </div>
//                           <div className="flex-shrink-0 flex flex-col items-end space-y-0.5">
//                             <p className="text-gray-400 text-[8px] md:text-[10px] whitespace-nowrap">
//                               {item.time || item.date}
//                             </p>
//                             <div className="flex items-center">
//                               <span
//                                 className={`font-medium px-1 py-0.5 rounded-md text-[8px] md:text-[10px] ${
//                                   item.status === "Open"
//                                     ? "bg-blue-100 text-blue-700"
//                                     : item.status === "Sent"
//                                     ? "bg-purple-100 text-purple-700"
//                                     : "bg-fuchsia-100 text-fuchsia-700"
//                                 }`}
//                               >
//                                 {item.status}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Contract Rendering - Mobile optimized */}
//                     {item.type === "contract" && (
//                       <div
//                         className={`rounded-md text-[9px] md:text-xs leading-tight p-1 border-l-4 ${getBorderColor(
//                           item.type,
//                           item.status
//                         )} ${getBackgroundColor(item.type, item.status)}`}
//                       >
//                         <div className="flex justify-between items-start gap-1 overflow-hidden">
//                           <div className="truncate">
//                             <p className="font-semibold text-gray-800 truncate">
//                               {item.title}
//                             </p>
//                           </div>
//                           <div className="flex-shrink-0 flex flex-col items-end space-y-0.5">
//                             {item.date && (
//                               <p className="text-gray-400 text-[8px] md:text-[10px] whitespace-nowrap">
//                                 {item.date}
//                               </p>
//                             )}
//                             <div className="flex items-center">
//                               <span
//                                 className={`font-medium px-1 py-0.5 rounded-md text-[8px] md:text-[10px] ${
//                                   item.status === "Accepted"
//                                     ? "bg-green-100 text-green-700"
//                                     : item.status === "Pending"
//                                     ? "bg-yellow-100 text-yellow-700"
//                                     : "bg-gray-100 text-gray-700"
//                                 }`}
//                               >
//                                 {item.status}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CalendarView7Col;

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  getDate,
  isToday,
} from "date-fns";
import { API_BASE_URL } from "../../api";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Modal from "../../Components/common/modal";

const getBorderColor = (itemType, statusOrColor) => {
  if (itemType === "event") {
    switch (statusOrColor) {
      case "fuchsia":
        return "border-fuchsia-400";
      case "blue":
        return "border-blue-400";
      case "purple":
        return "border-purple-400";
      default:
        return "border-gray-400";
    }
  } else if (itemType === "contract") {
    switch (statusOrColor) {
      case "Accepted":
        return "border-green-400";
      case "Pending":
        return "border-yellow-400";
      default:
        return "border-gray-400";
    }
  }
  return "border-gray-400";
};

const getBackgroundColor = (itemType, statusOrColor) => {
  if (itemType === "event") {
    switch (statusOrColor) {
      case "fuchsia":
        return "bg-fuchsia-50";
      case "blue":
        return "bg-blue-50";
      case "purple":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  } else if (itemType === "contract") {
    switch (statusOrColor) {
      case "Accepted":
        return "bg-green-50";
      case "Pending":
        return "bg-yellow-50";
      default:
        return "bg-gray-50";
    }
  }
  return "bg-gray-50";
};

function CalendarView7Col({ userId, fetchData, setEdit, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [events1, setEvents1] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [contractId, setContractId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toastShown, setToastShown] = useState(false);

  // New state variables for modals
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("useremail");
      setUserEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const fetchContractByEmail = async () => {
      if (!userEmail) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/contracts/by-email/${userEmail}`
        );

        if (res.status === 200 && Array.isArray(res.data)) {
          setContracts(res.data);
        } else if (res.status === 200 && res.data.contract) {
          setContracts([res.data.contract]);
        } else {
          setContracts([]);
        }
      } catch (error) {
        console.error("Failed to fetch contract by email:", error);
        setContracts([]);
      }
    };

    fetchContractByEmail();
  }, [userEmail]);

  useEffect(() => {
    const fetchContractsByUserId = async () => {
      if (!userId || (contracts.length > 0 && userEmail)) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/contracts/get-contracts/${userId}`
        );
        if (res.status === 200 && Array.isArray(res.data)) {
          setContracts(res.data);
        } else {
          console.warn(
            "Unexpected response format or status fetching contracts by user ID:",
            res
          );
        }
      } catch (error) {
        console.error("Failed to fetch contracts by user ID:", error);
      }
    };

    fetchContractsByUserId();
  }, [userId, userEmail]);

  useEffect(() => {
    const fetchContractById = async () => {
      if (!contractId) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/contracts/get-contract-by-id?id=${contractId}`
        );

        if (res.status === 200 && res.data) {
          setContracts([res.data]);
        }
      } catch (error) {
        console.error("Failed to fetch contract by ID:", error);
      }
    };

    fetchContractById();
  }, [contractId]);

  useEffect(() => {
    const fetchEventsById = async () => {
      if (!userId) {
        setEvents([]);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/calender/get/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching calendar events by ID:", error);
        setEvents([]);
      }
    };
    fetchEventsById();
  }, [userId, fetchData]);

  useEffect(() => {
    const fetchEventsByEmail = async () => {
      const email = localStorage.getItem("useremail");
      if (!email) {
        console.log("Email not found in localStorage for fetching events");
        setEvents1([]);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/calender/get-by-email/${email}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.events) {
          setEvents1(data.events);
        } else {
          console.log(data.message || "No events found for email");
          setEvents1([]);
        }
      } catch (err) {
        console.error("Error fetching calendar events by email:", err);
        setEvents1([]);
      }
    };
    fetchEventsByEmail();
  }, []);

  const handleOpenEventModal = (event) => {
    setSelectedEvent(event);
    setOpenEventModal(true);
  };

  const handleCloseEventModal = () => {
    setOpenEventModal(false);
    setSelectedEvent(null);
  };

  const handleOpenDeleteModal = (eventId) => {
    setEventToDelete(eventId);
    setOpenDeleteModal(true);
    setOpenEventModal(false); // Close the event modal if it's open
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setEventToDelete(null);
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;

    setEdit({
      ...selectedEvent.originalEvent,
      _id: selectedEvent.id,
    });
    onClose();
    handleCloseEventModal();
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || deleting) return;

    try {
      setDeleting(true);
      const response = await fetch(
        `${API_BASE_URL}/calender/calendar-event-delete/${eventToDelete}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (response.ok) {
        setEvents((prev) =>
          prev.filter((event) => event._id !== eventToDelete)
        );
        setEvents1((prev) =>
          prev.filter((event) => event._id !== eventToDelete)
        );

        // Fix duplicate toast issue
        if (!toastShown) {
          toast.success("Event deleted successfully!");
          setToastShown(true);
          // Reset toast flag after a short delay
          setTimeout(() => setToastShown(false), 2000);
        }
      } else {
        toast.error(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      toast.error("Something went wrong while deleting the event");
    } finally {
      handleCloseDeleteModal();
      setDeleting(false);
    }
  };

  const monthName = format(currentDate, "MMMM, yyyy");
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const daysInGrid = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const gridCells = [];
    let dayCursor = startDate;

    while (dayCursor <= endDate) {
      const dayOfMonth = getDate(dayCursor);
      const isCurrent = isSameMonth(dayCursor, currentDate);
      const isTodaysDate = isToday(dayCursor);
      const formattedCursorDate = format(dayCursor, "yyyy-MM-dd");

      const relevantEventsSource =
        events1 && events1.length > 0 ? events1 : events;
      const filteredEvents = (relevantEventsSource || []).filter((ev) => {
        if (!ev || !ev.date) return false;
        try {
          return (
            format(new Date(ev.date), "yyyy-MM-dd") === formattedCursorDate
          );
        } catch (e) {
          console.error("Error parsing event date:", ev.date, e);
          return false;
        }
      });

      const mappedEvents = filteredEvents.map((ev) => ({
        id: ev._id,
        type: "event",
        title: ev.eventName,
        email: ev.email,
        eventName: ev.eventName,
        referralName: ev.referralName,
        subtitle: ev.referralName,
        date: format(new Date(ev.date), "dd MMM yy"),
        status: ev.status,
        color:
          ev.status === "Open"
            ? "blue"
            : ev.status === "Sent"
            ? "purple"
            : "fuchsia",

        originalEvent: ev,
      }));

      const filteredContracts = (contracts || []).filter((contract) => {
        if (!contract || !contract.date) return false;
        try {
          return (
            format(new Date(contract.date), "yyyy-MM-dd") ===
            formattedCursorDate
          );
        } catch (e) {
          console.error("Error parsing contract date:", contract.date, e);
          return false;
        }
      });

      const mappedContracts = filteredContracts.map((contract) => ({
        id: contract._id,
        type: "contract",
        title: contract.name,
        subtitle: `Contract ${contract.status}`,
        date: format(new Date(contract.date), "dd MMM yy"),
        status: contract.status,
        originalContract: contract,
      }));

      gridCells.push({
        day: dayOfMonth,
        isCurrentMonth: isCurrent,
        isToday: isTodaysDate,
        items: [...mappedEvents, ...mappedContracts],
        fullDate: dayCursor,
      });

      dayCursor = addDays(dayCursor, 1);
    }

    return gridCells;
  }, [currentDate, events, events1, contracts]);

  const goToPreviousMonth = () => {
    setCurrentDate((current) => subMonths(current, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((current) => addMonths(current, 1));
  };

  return (
    <div className="mt-5">
      <div className="bg-white rounded-2xl p-3 md:p-6">
        {/* Month Navigation */}
        <div className="flex justify-center gap-4 items-center mb-4 px-2">
          <button
            onClick={goToPreviousMonth}
            className="text-blue-500 hover:text-blue-700 p-2 disabled:text-gray-300 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Previous month"
          >
            <FaArrowLeftLong size={18} />
          </button>
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 w-36 text-center">
            {monthName}
          </h2>
          <button
            onClick={goToNextMonth}
            className="text-blue-500 hover:text-blue-700 p-2 disabled:text-gray-300 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Next month"
          >
            <FaArrowRightLong size={18} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-t border-l border-gray-200 text-xs md:text-sm">
          {/* Weekday Headers - Smaller on mobile */}
          {weekdays.map((weekday) => (
            <div
              key={weekday}
              className="relative border-b border-r border-gray-200 py-2 px-0.5 md:px-2 text-center bg-gray-50"
            >
              <span className="text-[10px] md:text-xs font-medium text-gray-600">
                {weekday.substring(0, 3)}
              </span>
            </div>
          ))}

          {/* Day Cells - Improved height and scrolling */}
          {daysInGrid?.map((dayInfo) => (
            <div
              key={dayInfo.fullDate.toISOString()}
              className={`relative border-b border-r border-gray-200 h-[85px] md:h-[140px] p-1 md:p-2 overflow-hidden ${
                dayInfo.isCurrentMonth ? "bg-white" : "bg-gray-50"
              }`}
            >
              {/* Day Number - Better positioned */}
              <span
                className={`absolute top-1 right-1 text-xs md:text-sm font-medium flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full ${
                  dayInfo.isToday
                    ? "bg-blue-500 text-white"
                    : dayInfo.isCurrentMonth
                    ? "text-gray-700"
                    : "text-gray-300"
                }`}
              >
                {dayInfo.day}
              </span>

              {/* Improved Scrollable Items Container */}
              <div
                className="mt-6 md:mt-7 h-[55px] md:h-[110px] overflow-y-auto space-y-1 pr-1"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#E5E7EB transparent",
                }}
              >
                {/* Custom scrollbar styles for Webkit browsers */}
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 4px;
                  }
                  div::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  div::-webkit-scrollbar-thumb {
                    background-color: #e5e7eb;
                    border-radius: 20px;
                  }
                `}</style>

                {dayInfo?.items?.map((item, index) => (
                  <div
                    key={`${item.type}-${item.id}-${index}`}
                    className="mb-1 last:mb-1.5" // Ensure the last item has bottom margin
                  >
                    {/* Event Rendering - Improved visibility */}
                    {item.type === "event" && (
                      <div
                        onClick={() => handleOpenEventModal(item)}
                        className={`cursor-pointer rounded-md text-[9px] md:text-xs leading-tight p-1 border-l-4 ${getBorderColor(
                          item.type,
                          item.color
                        )} ${getBackgroundColor(item.type, item.color)}`}
                      >
                        {/* Event Content - Improved layout */}
                        <div className="flex justify-between items-start gap-1 overflow-hidden">
                          <div className="truncate max-w-[70%]">
                            <p className="font-semibold text-gray-800 truncate">
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p className="text-gray-500 text-[8px] md:text-[10px] truncate">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end space-y-0.5">
                            <p className="text-gray-400 text-[8px] md:text-[10px] whitespace-nowrap">
                              {item.time || item.date}
                            </p>
                            <div className="flex items-center">
                              <span
                                className={`font-medium px-1 py-0.5 rounded-md text-[8px] md:text-[10px] ${
                                  item.status === "Open"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.status === "Sent"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-fuchsia-100 text-fuchsia-700"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contract Rendering - Improved visibility */}
                    {item.type === "contract" && (
                      <div
                        className={`rounded-md text-[9px] md:text-xs leading-tight p-1 border-l-4 ${getBorderColor(
                          item.type,
                          item.status
                        )} ${getBackgroundColor(item.type, item.status)}`}
                      >
                        <div className="flex justify-between items-start gap-1 overflow-hidden">
                          <div className="truncate max-w-[70%]">
                            <p className="font-semibold text-gray-800 truncate">
                              {item.title}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end space-y-0.5">
                            {item.date && (
                              <p className="text-gray-400 text-[8px] md:text-[10px] whitespace-nowrap">
                                {item.date}
                              </p>
                            )}
                            <div className="flex items-center">
                              <span
                                className={`font-medium px-1 py-0.5 rounded-md text-[8px] md:text-[10px] ${
                                  item.status === "Accepted"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal isOpen={openEventModal} onClose={handleCloseEventModal}>
        <div className="sm:p-6 p-4">
          {selectedEvent && (
            <>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEvent.title}
                </h3>
                <button
                  onClick={handleCloseEventModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-2 space-y-3">
                {selectedEvent.subtitle && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Referral:</span>{" "}
                    {selectedEvent.subtitle}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {selectedEvent.date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  {selectedEvent.status}
                </p>
                {selectedEvent.email && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedEvent.email}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleEditEvent}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Event
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(selectedEvent.id)}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Event
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={openDeleteModal} onClose={handleCloseDeleteModal}>
        <div className="sm:p-6 p-4 text-center">
          <svg
            className="mx-auto mb-4 text-red-500 w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Event
          </h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this event?
          </p>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handleCloseDeleteModal}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
            >
              {deleting ? "Deleting..." : "Delete Event"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarView7Col;
