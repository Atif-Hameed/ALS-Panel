'use client';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_URL } from '../../api';
import { io } from 'socket.io-client';

const socket = io(API_URL);

const SendIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
    />
  </svg>
);

const ChatInput = ({ recipientId, senderId, agentId, messages, setMessages }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Socket connected?', socket);
    console.log('Recipient ID is:', JSON.stringify(recipientId));

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection failed:', err.message);
    });

    socket.on('new-conversation', (message) => {
      console.log('New conversation message:', message);

      // Normalize the incoming message to match the API message structure
      const normalizedMessage = {
        _id: message._id,
        content: message.content,
        createdAt: message.createdAt,
        conversationId: message.conversationId,
        sender: {
          _id: message.sender,
          name: message.senderName || 'Unknown', // Adjust based on your backend response
          model: message.senderModel,
        },
        isMe: message.sender === (agentId || senderId), // Determine if the message is from the current user
      };

      setMessages((prevMessages) => [...prevMessages, normalizedMessage]);
    });

    return () => {
      socket.off('new-conversation');
      socket.disconnect();
    };
  }, [agentId, senderId]); // Add dependencies to re-run if these change

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const payload = {
      senderId: agentId || senderId,
      senderModel: agentId ? 'Agents' : 'userAccounts',
      content: message,
      recipientId,
    };

    console.log('Payload:', payload);

    try {
      socket.emit('conversation', payload);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full pt-2  px-4">
      <div className="flex items-center  p-1.5 bg-[#FFFFFF] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.04)] border border-[#D8E0F0] space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="flex-grow px-4 py-2 text-sm text-gray-800 placeholder-[#7D8592] bg-transparent border-none focus:outline-none focus:ring-0"
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="flex-shrink-0 px-3 py-2 bg-[#002B4B] rounded-[14px] hover:bg-[#1f3d5c] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0A2540]/50 transition-colors duration-150"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;