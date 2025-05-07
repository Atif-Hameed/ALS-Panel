// components/ListingCard.tsx
import React from 'react';
import Image from 'next/image'; // Use next/image for optimization

const ListingCard = ({
  imageUrl,
  location,
  title,
  status,
  statusColorClass , // Default color like the image
  showLiveWebsite = true, // Default to showing it like the image
  liveWebsiteColorClass, // Default color like the image
  imageAlt = 'Listing image', // Default alt text
}) => {
  return (
    <div className="flex relative items-center p-4 bg-[#F4F9FD] rounded-[24px] max-w-[352px] space-x-4  transition-shadow duration-200 ease-in-out">
      {/* Image */}
      <div className="flex-shrink-0">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={79} 
          height={75} // Adjust height to match width for aspect ratio
          className=" rounded-xl object-cover" // Match aspect ratio and rounding
        />
      </div>

      {/* Text Content */}
      <div className="flex min-w-0 flex-1 flex-col space-y-0.5">
         {/* Location */}
         <p className="text-sm text-[#91929E]">{location}</p>
        {/* Title */}
        <div className="text-lg font-bold text-[#0A1629] truncate">
          {title}
        </div>
         {/* Status */}
         <p className={`text-sm font-[700] text-[#FFBD21] ${statusColorClass}`}>
           {status}
         </p>
      </div>

      {/* Live Website Badge (Optional) */}
      {showLiveWebsite && (
        <div className="absolute sm:top-4 top-0 right-4">
           <span className={`text-sm font-semibold ${liveWebsiteColorClass}`}>
             Live website
           </span>
        </div>
      )}
    </div>
  );
};

export default ListingCard;