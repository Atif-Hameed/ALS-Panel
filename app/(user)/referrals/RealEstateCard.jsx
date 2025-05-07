import React from 'react';
import Image from 'next/image'; 



const RealEstateCard = ({
  imageUrl,
  altText = 'Real estate listing', 
  title,
  locationLine1,
  locationLine2,
  agentCount,
}) => {
  const agentText = `${agentCount} Agent${agentCount !== 1 ? 's' : ''}`;

  return (
    <div className="flex items-center p-4 bg-[#F4F9FD] rounded-[24px] max-w-[352px] space-x-4  transition-shadow duration-200 ease-in-out">
      <div className="flex-shrink-0">
        <Image
          src={imageUrl}
          alt={altText}
          width={79} 
          height={75}
          className="rounded-lg object-cover" 
        />
      </div>

      {/* Text Content Section */}
      <div className="flex-1 min-w-0"> {/* flex-1 allows text to take remaining space, min-w-0 prevents overflow issues */}
        <h3 className="text-lg font-bold text-[#0A1629] truncate">{title}</h3> {/* truncate prevents long titles from breaking layout */}
        <p className="text-sm text-[#91929E] mt-1">{locationLine1}</p>

        <div className='flex justify-between'>
        <div className="text-sm text-[#91929E]">{locationLine2}</div>
        <div className="text-sm font-[700] text-[#FFBD21] ">{agentText}</div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCard;