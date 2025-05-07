"use client";
import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../api";

const SendIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
    />
  </svg>
);

const ChatInput = ({
  senderId,
  message,
  selectedUserId,
  setMessages,
  messages,
  handleSendMessage,
  setMessage,
  setSelectedUserId,
}) => {
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const dropdownRef = useRef(null);
  const inputContainerRef = useRef(null);
  const inputRef = useRef(null);

  console.log(message, "fffff", selectedUserId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/board/all-users`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const formattedUsers = data.data
            .filter((user) => user.firstName)
            .map((user) => ({
              _id: user._id,
              firstName: user.firstName,
            }));
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setMessage(val);

    const atIndex = val.lastIndexOf("@");
    const cursorPosition = e.target.selectionStart;

    if (atIndex !== -1 && cursorPosition > atIndex) {
      const spaceAfterAt = val.indexOf(" ", atIndex + 1);
      if (spaceAfterAt !== -1 && cursorPosition > spaceAfterAt) {
        setShowDropdown(false);
        setFilteredUsers([]);
        return;
      }

      const potentialQuery = val.slice(atIndex + 1, cursorPosition);
      if (potentialQuery.includes(" ")) {
        setShowDropdown(false);
        setFilteredUsers([]);
        return;
      }

      const query = potentialQuery.toLowerCase();
      const matches = users.filter((user) =>
        user.firstName.toLowerCase().startsWith(query)
      );
      setFilteredUsers(matches);
      setShowDropdown(matches.length > 0);
    } else {
      setShowDropdown(false);
      setFilteredUsers([]);
    }
  };

  const handleUserClick = (user) => {
    const atIndex = message.lastIndexOf("@");
    if (atIndex === -1) return;

    const beforeAt = message.slice(0, atIndex);
    const potentialMentionEndIndex = message.indexOf(" ", atIndex + 1);
    const textAfterMention =
      potentialMentionEndIndex !== -1
        ? message.slice(potentialMentionEndIndex)
        : "";

    const newMessage = `${beforeAt}@${
      user.firstName
    } ${textAfterMention.trimStart()}`;
    setMessage(newMessage);
    setShowDropdown(false);
    setFilteredUsers([]);
    setSelectedUserId(user._id); // NEW

    inputRef.current?.focus();
    const newCursorPosition = `${beforeAt}@${user.firstName} `.length;
    setTimeout(() => {
      inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputContainerRef.current &&
        !inputContainerRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-full">
      {showDropdown && (
        <ul
          ref={dropdownRef}
          className="absolute z-10 w-full bottom-[100%] mb-1 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg"
        >
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              @{user.firstName}
            </li>
          ))}
        </ul>
      )}

      <div
        ref={inputContainerRef}
        className="flex items-center mt-4 p-1.5 bg-[#FFFFFF] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.04)] border border-[#D8E0F0] space-x-2"
      >
        <textarea
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => {
			e.target.style.height = "auto"; // Reset height
			e.target.style.height = `${e.target?.scrollHeight}px`;
            if (showDropdown && filteredUsers.length > 0) {
              if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                handleUserClick(filteredUsers[0]);
              }
            } else {
              if (e.key === "Enter") {
                if (e?.shiftKey) {
                 
                  // Shift + Enter should allow a new line (default behavior)
                  return;
                }
                e.preventDefault();
                handleSendMessage();
              }
            }
          }}
          // onClick={handleInputChange} // Re-evaluate dropdown visibility on click
          placeholder="Type your message here... (Shift + Enter for new line)"
          rows={1}
          className="flex-grow resize-none px-4 py-2 text-sm text-gray-800 placeholder-[#7D8592] bg-transparent border-none focus:outline-none focus:ring-0"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
          }}
        />

        <button
          type="submit"
          onClick={handleSendMessage} // Define this function if you have message sending logic
          className="flex-shrink-0 px-3 py-2 bg-[#002B4B] rounded-[14px] hover:bg-[#1f3d5c] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0A2540]/50 transition-colors duration-150"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
