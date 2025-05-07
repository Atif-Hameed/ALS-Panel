import Image from 'next/image';
import { FaStar } from 'react-icons/fa'; 

const ReviewCard = ({
  avatarUrl,
  name,
  email,
  reviewText,
  rating,
}) => {
  const totalStars = 5;

  return (
    <div className="bg-white rounded-2xl mt-3.5 shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:space-x-5 space-y-4 sm:space-y-0 items-start sm:items-center justify-between">
        {/* Avatar and Name */}
        <div className="flex items-center gap-3">
          <Image
            src={avatarUrl}
            alt={`${name}'s avatar`}
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="text-[16px] font-bold text-[#0A1629]">{name}</h3>
            <p className="text-sm font-[400] text-[#91929E]">{email}</p>
          </div>
        </div>

        {/* Review Text */}
        <p className="text-[15px] sm:text-[16px] font-[400] text-[#000000] leading-relaxed sm:w-[300px] w-full">
          {reviewText}
        </p>

        {/* Star Rating */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalStars }, (_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={index}
                size={20}
                className={starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
