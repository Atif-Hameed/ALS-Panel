// components/ProfileCard.tsx
import Image from 'next/image';

const ProfileCard = ({ name, email, role, title ,imageUrl }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl w-full shadow-sm">
      <div className="relative w-[40px] h-[40px] rounded-full ring-2 ring-blue-500">
        <Image
          src={imageUrl} // Replace with the actual image path
          alt="Louis Castro"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p className="font-bold text-[#0A1629] text-[16px]">{name}</p>
        <p className="text-sm text-[#0A1629]">{title}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
