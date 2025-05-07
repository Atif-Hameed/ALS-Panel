import Image from "next/image";

const Card = ({ name, role, level, imageSrc, progress = 75, onRemove ,profileImage}) => {
  const radius = 30;
  const stroke = 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
console.log("profileImage",profileImage)
  return (
    <div className="bg-[#F4F9FD] text-center rounded-[24px] md:p-6 p-3 flex flex-col items-center w-full relative">
      <button onClick={onRemove} className="absolute cursor-pointer top-2 right-2 text-[#B5B5B4] text-sm hover:text-gray-600">
        ✕
      </button>

      <div className="relative w-[60px] h-[60px]">
        {/* SVG Circular Progress */}
        <svg
          height="60"
          width="60"
          className="absolute top-0 right-0"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        >
          {/* Gray track (full circle) */}
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="30"
            cy="30"
          />
          {/* Progress circle (clockwise from top) */}
          <circle
            stroke="#3F8CFF"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx="30"
            cy="30"
            style={{ transform: 'rotate(-270deg)', transformOrigin: 'center' }}
          />
        </svg>

        {/* Image in center */}
        <div className="p-[5px] rounded-full">
          <Image
            src={profileImage || imageSrc}
            alt={name}
            className="rounded-full"
            width={58}
            height={58}
          />
        </div>
      </div>

      <h2 className="sm:text-[16px] break-all text-sm text-[#0A1629] font-[700] mt-3">{name}</h2>

      <p className="text-[#0A1629] text-[14px] font-[400]">{role}</p>

      {/* <div className="border border-[#7D8592] text-[#7D8592] text-xs font-[600] px-1 py-0.5 rounded-[4px] mt-2">
        {level}
      </div> */}
    </div>
  );
};

export default Card;