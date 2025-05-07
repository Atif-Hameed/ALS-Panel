"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { API_BASE_URL } from "../../api";
import { io } from "socket.io-client";

const PAGE_SIZE = 10;

const BoardPage = () => {
  const [senderId, setSenderId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const loadMoreMessages = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Save current scroll height and position
      const container = messagesContainerRef.current;
      const scrollHeightBefore = container.scrollHeight;
      const scrollTopBefore = container.scrollTop;

      const res = await fetch(
        `${API_BASE_URL}/board/all?page=${page + 1}&limit=${PAGE_SIZE}`
      );
      const data = await res.json();

      if (data.success && data.data.length > 0) {
        setMessages((prev) => [...data.data, ...prev]);
        setPage((prev) => prev + 1);

        // Restore scroll position
        const scrollHeightAfter = container.scrollHeight;
        container.scrollTop =
          scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);

        if (data.data.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch more messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = useCallback(() => {
    if (initialLoad) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setInitialLoad(false);
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [initialLoad]);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const container = messagesContainerRef.current;
    if (container && container.scrollTop < 100) {
      loadMoreMessages();
    }
  }, [isLoading, hasMore]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/board/all?page=1&limit=${PAGE_SIZE}`
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        setPage(1);
        setHasMore(data.data.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    socketRef.current.on("connect", () => {
      console.log("connected to server");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    socketRef.current.on("new-message", (message) => {
      console.log("new-message", message);
      setMessages((prevMessages) => {
        const updated = [...prevMessages, message];
        setTimeout(() => scrollToBottom(), 100);
        return updated;
      });
    });

    return () => {
      socketRef.current.off("new-message");
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setSenderId(storedUserId);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleSendMessage = async () => {
    if (message === "") return;
    if (!senderId) return;

    try {
      socketRef.current?.emit("send-message", {
        senderId: senderId.trim(),
        receiverId: selectedUserId?.trim() || null,
        content: message,
      });
      setMessage("");
      setSelectedUserId(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="h-full">
      <h1 className="text-[#0A1629] font-bold text-[28px] sm:text-[36px] w-full">
        Board
      </h1>
      <div className="bg-white p-3 h-[calc(100%-70px)] rounded-[24px] overflow-auto">
        <div className="flex justify-center items-center">
          <div className="border-[#E6EBF5] flex justify-center items-center py-2 border rounded-[20px] w-[168px] self-center text-[14px] font-[600]">
            {messages.length > 0
              ? formatDate(messages[messages.length - 1].createdAt)
              : formatDate(new Date())}
          </div>
        </div>

        <div
          className="flex mt-4 flex-col gap-3 h-[calc(100vh-315px)] overflow-y-auto"
          ref={messagesContainerRef}
        >
          {isLoading && page === 1 ? (
            <div>Loading...</div>
          ) : (
            <>
              {hasMore && !initialLoad && (
                <div className="text-center py-2">
                  <button
                    onClick={loadMoreMessages}
                    disabled={isLoading}
                    className="text-sm text-gray-500"
                  >
                    {isLoading ? "Loading..." : "Load older messages"}
                  </button>
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage
                  key={msg._id}
                  profilePicUrl={msg.sender?.profileImage}
                  name={msg.sender?.publicName || msg.sender?.userName}
                  title={msg.sender.agent ? msg.sender.agent.title : msg.sender?.role}
                  message={msg.content}
                  time={new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  isCurrentUser={msg.sender?._id === senderId}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="h-fit">
          <ChatInput
            message={message}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            handleSendMessage={handleSendMessage}
            setMessage={setMessage}
            setMessages={setMessages}
            messages={messages}
            senderId={senderId}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardPage;