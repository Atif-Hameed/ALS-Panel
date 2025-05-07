// components/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value ,bg }) => {
// console.log(value,"value")
  const svgSize = 128; 
  const strokeWidth = 5;
  const radius = (svgSize - strokeWidth) / 2; 
// 1. Calculate offset dynamically based on value
const circumference = 2 * Math.PI * radius;

const percentage = Math.min(value, 100); // cap to 100
const progressOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white w-full p-6 rounded-[24px] flex flex-col items-start h-[193px]">
      <div className="relative w-[72px] h-[72px] mb-4"> 
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${svgSize} ${svgSize}`} 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            className="stroke-gray-200" 
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
            stroke={bg}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ color: bg }} className="text-[24px] font-[800] ">{value}</span>
        </div>
      </div>

      <h2 className="text-[18px] font-bold text-[#0A1629]">{title}</h2>
      <p className="text-[14px] text-[#91929E] mt-1">{value}</p>
    </div>
  );
};



export default StatsCard;