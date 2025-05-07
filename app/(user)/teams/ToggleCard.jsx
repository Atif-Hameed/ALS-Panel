'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

const ToggleCard = ({
  imageSrc,
  label,
  defaultChecked = false,
  onToggle,
  onRemove,
  uploadedAt,
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // Sync internal state with prop changes
  useEffect(() => {
    setIsChecked(defaultChecked);
  }, [defaultChecked]);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onToggle) {
      onToggle(imageSrc); // Pass the logo URL to parent
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(imageSrc); // Pass the logo URL to parent
    }
  };

  return (
    <div className="flex items-center  justify-between sm:gap-x-32 gap-3 lg:w-3/4   bg-white">
      <div className="flex items-center gap-4 flex-1">
        {/* Logo Image */}
        <div className="w-16 h-16 relative flex-shrink-0">
          <Image 
            src={imageSrc} 
            alt={label} 
            width={64} 
            height={64} 
            className="w-full h-full object-contain"
            unoptimized // For external URLs
          />
        </div>

        {/* Logo Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{label}</p>
          {uploadedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Uploaded: {new Date(uploadedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Display Status */}
        {isChecked && (
          <span className="text-xs font-medium text-green-600 px-2 py-1 bg-green-50 rounded-full">
            ✔ Displaying
          </span>
        )}
      </div>

      {/* Actions */}
      <div className=" ml-4 flex items-center gap-4">
        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className={`w-10 h-6 rounded-full border-2 transition-colors duration-200
            ${isChecked ? "bg-white border-green-500" : "bg-white border-gray-300"}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-200
              ${isChecked ? "bg-green-500 translate-x-[18px]" : "bg-gray-300 translate-x-[3px]"}`} />
          </div>
        </label>

        {/* Remove Button */}
        <button 
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove logo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToggleCard;