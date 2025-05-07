'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '../../api'
const ChatUserCard = ({
  avatarUrl,
  name,
  unreadCount = 0,
  setConversationId,
  id,
  index,
  setMainUserId,
  setRecipientId,
  setSelectedAgent,

}) => {
  const [lastMessage, setLastMessage] = useState('Loading...');
  const [lastMessageTime, setLastMessageTime] = useState('');
  const [localConversationId, setLocalConversationId] = useState(null);
  const [localMainUserId, setLocalMainUserId] = useState(null);

  console.log(name)

  console.log("ID is: ", id)

  useEffect(() => {
    const fetchLastMessage = async () => {
      if (!id) {
        setLastMessage('No agent ID');
        setLocalConversationId(null);
        setLocalMainUserId(null);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/chat/conversation-by-agent/${id}`);

        console.log(res)

        if (!res.ok) {
          if (res.status === 404) {
            setLastMessage('No conversation found');
          } else {
            throw new Error(`Failed to fetch conversation: ${res.statusText}`);
          }
          setLocalConversationId(null);
          setLocalMainUserId(null);
          return;
        }

        const data = await res.json();
        console.log(data, "Conversation data fetched");

        // Update all local states first
        setLocalConversationId(data.conversationId);
        setLocalMainUserId(data.mainUserId);
        setLastMessage(data.lastMessageContent || 'No messages yet');

        // Format time if available
        if (data.lastMessageCreatedAt) {
          const date = new Date(data.lastMessageCreatedAt);
          const formattedTime = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          setLastMessageTime(formattedTime);
        } else {
          setLastMessageTime('');
        }

        // Only update parent state if this is the first card (index 0)
        // AND if we don't already have a conversationId in parent
        if (index === 0 && data.conversationId && !conversationId) {
          setConversationId(data.conversationId);
          setMainUserId(data.mainUserId);
        }

      } catch (err) {
        console.error("Error fetching last message for agent ID:", id, err);
        setLastMessage('Error loading message');
        setLocalConversationId(null);
        setMainUserId(null);
        setLastMessageTime('');
      }
    };

    fetchLastMessage();
  }, [id, index, setConversationId, setMainUserId]);


  const handleClick = () => {

    if (id) {
      setRecipientId(id)
      setSelectedAgent({ _id: id, name });
    }
    console.log(localConversationId)
    if (localConversationId) {
      // console.log(`Card clicked (index: ${index}), setting conversationId to: ${localConversationId}`);
      setConversationId(localConversationId);
      if (localMainUserId) setMainUserId(localMainUserId);

    } else {
      console.warn(`Card clicked (index: ${index}), but no localConversationId is available.`);
      setConversationId(null);

    }
  };

  // console.log(avatarUrl)

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between px-3 py-2 hover:bg-[#F4F9FD] rounded-[14px] cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Image
          src={avatarUrl}
          alt={name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-[16px] font-bold text-[#0A1629] ">{name}</p>
          <p className="text-[14px] text-[#91929E] font-[400] truncate w-40">
            {lastMessage.length > 25 ? `${lastMessage.slice(0, 25)}...` : lastMessage}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-[14px] font-[600] text-[#7D8592]">{lastMessageTime}</span>
        {unreadCount > 0 && (
          <span className="bg-[#F65160] text-white text-xs w-[25px] h-[18px] rounded-[9px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatUserCard;