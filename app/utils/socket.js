// utils/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      autoConnect: false,
      transports: ['websocket'], // optional: forces websocket
    });
  }
  return socket;
};
