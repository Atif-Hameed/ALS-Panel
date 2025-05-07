// components/TeamCard.tsx
import Image from "next/image";

const TeamCard = ({ name, city, agentCount ,imageUrl,agentData }) => {

  const totalProperties = agentData?.reduce((acc, agent) => {
    return acc + (agent?.agentId?.properties?.length || 0);
  }, 0);
  return (
    <div className="flex items-center justify-between my-2 p-4 bg-[#F4F9FD] rounded-2xl w-full mx-auto">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image
            src={imageUrl} // Replace with your image path
            alt="Team A"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-[#0A1629] text-[16px]">{name}</p>
          <p className="text-sm text-[#91929E]">{city}</p>
        </div>
      </div>

      {/* Stats Section - Responsive */}
      <div className="flex flex-row sm:flex-row sm:gap-10 gap-10 sm:mr-28 text-sm text-left sm:text-left w-full sm:w-auto">
        <div>
          <p className="text-sm text-[#91929E]">Agents</p>
          <p className="text-[16px] text-[#0A1629]">{agentCount}</p>
        </div>
        <div>
          <p className="text-sm text-[#91929E]">Properties</p>
          <p className="text-[16px] text-[#0A1629]">{totalProperties}</p>
        </div>
        <div>
          <p className="text-sm text-[#91929E]">Sold</p>
          <p className="text-[16px] text-[#0A1629]">0</p>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
