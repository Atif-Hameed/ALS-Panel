import Image from 'next/image';

const ChatBubble = ({ avatarUrl, name, time, message, isSender }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 gap-2`}>
      {/* {!isSender && (
        <div className="flex-shrink-0">
          <Image 
            src={avatarUrl || '/default-profile.png'}
            alt={name}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10"
          />
        </div>
      )} */}
      
      <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* {!isSender && (
          <span className="text-sm font-medium text-gray-700 mb-1">
            {isSender ? 'You' : name}
          </span>
        )} */}
        
        <div className={`px-4 py-3 rounded-2xl ${isSender 
          ? 'bg-[#3B82F6] text-white rounded-tr-none' 
          : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
          <p className="text-sm">{message}</p>
        </div>
        
        <span className={`text-xs mt-1 ${isSender ? 'text-gray-500' : 'text-gray-400'}`}>
          {time}
        </span>
      </div>
      
      {/* {isSender && (
        <div className="flex-shrink-0">
          <Image
            src={avatarUrl || '/default-profile.png'}
            alt={name}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10"
          />
        </div>
      )} */}
    </div>
  );
};

export default ChatBubble;