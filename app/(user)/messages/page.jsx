'use client';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import ChatUserCard from './ChatUserCard';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { API_BASE_URL } from '../../api';
import { useUserDetails } from '../../hooks/useUser';
import { fetchUser, getRefer, getReferuser } from '../../actions/user.action';

const Message = () => {
  const [agents, setAgents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [agentsData, setAgentsData] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [referBy, setReferBy] = useState(null);
  const { data: user } = useUserDetails(userId)
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePopup = (e) => {
    e.stopPropagation();
    setPopup(!popup)
  }
  const handlePopup2 = (e) => {
    e.stopPropagation();
    setPopup2(!popup2)
  }

  useEffect(() => {
    const handleClickOutside = () => {
      if (popup) {
        setPopup(false);
      }
      if (popup2) {
        setPopup2(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [popup, popup2]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // console.log(user)

  // Get user ID from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }
  }, []);

  // Fetch agent data by email
  useEffect(() => {
    const fetchUserIdByEmail = async () => {
      const storedEmail = localStorage.getItem('useremail');
      if (!storedEmail) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/agents/by-email?email=${storedEmail}`
        );
        if (!response.ok) throw new Error('Failed to fetch user ID');

        const data = await response.json();
        setAgentId(data._id);
        setAgentsData([{
          ...data,
          profileImage: data.profileImage
            ? `${API_BASE_URL}${data.profileImage}`
            : '/assets/dumy.png'
        }]);
      } catch (error) {
        console.error('Error fetching user ID by email:', error);
      }
    };

    fetchUserIdByEmail();
  }, []);


  // Fetch messages for current conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !conversationId) {
        setMessages([]);
        return;
      }

      setMessagesLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/chat/get-measage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: agentId || userId,
            conversationId,
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch messages');

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, userId, agentId]);

  // Fetch all agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/agents/get-agents/${userId}?includeMessages=true`
        );
        const data = await response.json();

        // console.log(data)

        const formattedAgents = Array.isArray(data)
          ? data.map(agent => ({
            ...agent,
            profileImage: agent?.userId.profileImage
              ? agent?.userId.profileImage
              : '/assets/dumy.png',
            lastMessage: agent.lastMessage,
            unreadCount: agent.unreadCount || 0
          }))
          : [];

        setAgents(formattedAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAgents();
  }, [userId]);

  // console.log(agents)

  useEffect(() => {
    if (recipientId) {
      const foundAgent =
        agents.find((agent) => agent._id === recipientId) ||
        agentsData.find((agent) => agent._id === recipientId);

      if (foundAgent) {
        setSelectedAgent(foundAgent);
      }
    }
  }, [recipientId, agents, agentsData]);

  useEffect(() => {
    if (user?.referBy) {
      const fetchReferBy = async () => {
        try {
          const { data, error } = await fetchUser(user?.referBy);
          if (data?.user) {
            // Format the referBy user similarly to your agents data
            setReferBy({
              ...data.user,
              profileImage: data.user.profileImage
                ? `${data.user.profileImage}`
                : '/assets/dumy.png',
              lastMessage: null, // Add these fields if needed
              unreadCount: 0
            });
          }
        } catch (error) {
          console.error('Error fetching referBy user:', error);
        }
      };
      fetchReferBy();
    }
  }, [user?.referBy]);

  // console.log(referBy)

  // console.log(agentsData)
  // console.log(user)

  // Modified getMappedData with search filtering
  const getMappedData = () => {
    const baseData = [...agents];

    // Add agentsData if available
    if (agentsData.length > 0 && !user?.referBy) {
      baseData.push(...agentsData);
    }

    // Add referBy if available
    if (referBy) {
      baseData.push(referBy);
    }

    // Filter based on search query
    if (searchQuery.trim() === '') {
      return baseData;
    }

    return baseData.filter((person) =>
      (person.name || `${person.firstName} ${person.lastName}`)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  const clearConversation = async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/clear-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'), // Get from localStorage directly
          conversationId
        }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        // Refresh messages after clearing
        setMessages([]);
        return data;
      } else {
        throw new Error(data.message || 'Failed to clear conversation');
      }
    } catch (error) {
      console.error('Error clearing conversation:', error);
      throw error;
    }
  };



  return (
    <div className=' h-full overflow-hidden '>
      <h1 className='text-[#0A1629] font-bold text-[36px] mt-3 w-full'>
        Messages
      </h1>

      <div className={`bg-[#FFFFFF]  h-[calc(100%-67px)] rounded-[24px] flex `}>
        {/* Left sidebar */}
        <div className='w-[30%] border-r h-full border-[#E6EBF5]'>
          <div className='flex w-full justify-between items-center border-b px-4 h-[60px] border-[#E6EBF5]'>
            <div className='text-[#0A1629] font-bold text-[18px]'>
              Conversations
            </div>
            <div onClick={handlePopup2} className='rounded-[14px] bg-[#F4F9FD] p-2 cursor-pointer'>
              <FiSearch className='h-6 w-6 text-gray-600' />
            </div>
          </div>

          {popup2 && (
            <div className='sticky top-0  z-10 bg-white p-4 shadow-lg rounded-lg mt-2 mx-4 w-[calc(100%-32px)]'>
              <input
                type='text'
                value={searchQuery}
                onChange={handleSearch}
                placeholder='Search conversations...'
                className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                autoFocus
              />
            </div>
          )}

          <div className={`flex flex-col ${popup2 ? 'h-[calc(100vh-340px)]' : 'h-[calc(100vh-240px)]'}  px-2 py-2 gap-4  overflow-auto`}>


            {loading ? (
              <div className='flex justify-center py-8'>Loading...</div>
            ) : getMappedData()?.length === 0 ? (
              <div className='flex justify-center py-8'>No results found</div>
            ) : (
              getMappedData()?.map((person) => (
                <ChatUserCard
                  key={person._id}
                  id={agentId ? agentId : person._id}
                  avatarUrl={person.profileImage}
                  name={person.name || `${person.firstName} ${person.lastName}`}
                  unreadCount={person.unreadCount}
                  setConversationId={setConversationId}
                  setRecipientId={setRecipientId}
                  setSelectedAgent={setSelectedAgent}
                  role={person.role || (person._id === agentId ? 'Agent' : 'User')}
                  userId={userId}
                />
              ))
            )}

          </div>
        </div>

        {/* Right chat area */}
        <div className='w-[70%]  h-full overflow-auto '>

          <div className='border-b  flex items-center justify-between px-4 h-[60px] border-[#E6EBF5]'>
            {
              selectedAgent &&
              <div

                className='flex items-center gap-2 cursor-pointer'
              >
                <Image
                  src={selectedAgent?.profileImage || '/assets/dumy.png'}
                  alt={`${selectedAgent?.name || 'Agent'}'s avatar`}
                  width={44}
                  height={44}
                  className='rounded-full object-cover'
                />
                <div className='flex-1 sm:mb-0 sm:mr-6'>
                  <h3 className='text-sm font-bold text-[#0A1629]'>
                    {selectedAgent ? selectedAgent.name : 'Select a conversation'}
                  </h3>
                  <p className='text-[16px] font-[400] text-[#91929E]'>{selectedAgent?.title}</p>
                </div>
              </div>

            }

            {
              selectedAgent && !agentId &&
              <div className="relative">
                <div onClick={handlePopup} className='rounded-[14px] bg-[#F4F9FD] p-2 cursor-pointer'>
                  <Image
                    src={'/assets/threeDot.svg'}
                    alt="Menu"
                    width={24}
                    height={24}
                    className='rounded-full object-cover'
                  />
                </div>
                {popup && (
                  <div
                    className="absolute right-10 top-2 mt-2 z-50 bg-white shadow-xl rounded-md p-2 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                  >
                    <button
                      onClick={() => clearConversation(conversationId)}
                      className='w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-100 bg-gray-300 rounded-md text-dark'
                    >
                      Clear all Chat
                    </button>
                  </div>
                )}
              </div>
            }
          </div>

          <div className='p-4  relative h-[calc(100vh-300px)]   overflow-auto flex flex-col'>
            {
              selectedAgent &&
              <div className=' sticky top-0 flex w-full justify-center items-center'>
                <div className='border border-[#E6EBF5] rounded-[20px] text-[14px] font-[600] text-[#7D8592] px-4 py-1'>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </div>
            }

            {!selectedAgent ? (
              <div className='flex-1 flex flex-col items-center justify-center'>
                <p className='text-center text-gray-500'>
                  Select a conversation to start chatting
                </p>
              </div>
            ) : messagesLoading ? (
              <div className='flex-1 flex items-center justify-center'>
                <p className='text-center text-gray-500'>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className='flex-1 flex flex-col items-center justify-center'>
                <p className='text-center text-gray-500'>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div>
                {messages.map((msg, index) => (
                  <div key={index}>
                    <ChatBubble
                      avatarUrl={msg.sender?.profileImage || '/assets/dumy.png'}
                      name={msg.sender?.name}
                      time={new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      message={msg.content}
                      isSender={msg.isMe}
                    />
                  </div>
                ))}
                {/* Empty div at the bottom to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Always show input when an agent is selected, even if no messages exist */}
          {selectedAgent && (
            <ChatInput
              setMessages={setMessages}
              messages={messages}
              agentId={agentId}
              recipientId={recipientId}
              senderId={userId}
              conversationId={conversationId}
              setConversationId={setConversationId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;