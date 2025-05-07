'use client'
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const ChatMessage = ({
  profilePicUrl,
  name,
  title,
  message,
  time,
  isCurrentUser,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef(null);
  const maxLines = 5;
  const lineHeight = 24; // More standard line height

  useEffect(() => {
    if (textRef.current) {
      // Check if the content exceeds the specified number of lines
      const lineCount = Math.floor(textRef.current.scrollHeight / lineHeight);
      setNeedsTruncation(lineCount > maxLines);
    }
  }, [message]);



  return (
    <div className="w-full rounded-[26px] bg-[#F4F9FD] p-5 shadow-sm">
      <div className="flex items-start justify-between space-x-3">
        <div className="flex flex-shrink-0 items-start space-x-3">
            <img
              src={profilePicUrl ? profilePicUrl : '/assets/dumy.png'}
              alt={`${name}'s profileImage`}
              className="rounded-full shrink-0 object-cover"
              style={{ width: 50, height: 50 }}
            />
          <div>
            <div className="text-[16px] font-[700] text-[#0A1629]">
              {name}
            </div>
            <div className="text-[14px] font-[400] text-[#91929E]">{title}</div>
          </div>
        </div>
        <div className="flex-shrink-0 whitespace-nowrap pt-0.5 text-[14px] font-[400] text-[#3F8CFF]">
          {time}
        </div>
      </div>
      <div className="mt-3 pl-[52px]">
        <div>
          <p
            ref={textRef}
            onClick={() => isExpanded && setIsExpanded(!isExpanded)}
            className={`text-[16px] font-[400] break-all text-[#0A1629] whitespace-pre-line `}
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: isExpanded ? 'none' : maxLines,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {message}
          </p>

          {needsTruncation && !isExpanded && (
            <div 
            onClick={() => needsTruncation && setIsExpanded(!isExpanded)}
              className="cursor-pointer text-[14px] font-[500] text-[#3F8CFF] mt-1"
            >
              See more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;