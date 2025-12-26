import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const SOCKET_URL = API_BASE.replace("/api", "");

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get token from localStorage or sessionStorage
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!token) {
      console.log("No auth token found, skipping socket connection");
      return;
    }

    // Initialize socket connection
    console.log("Initializing socket connection to:", SOCKET_URL);
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setIsConnected(false);
    });

    return () => {
      console.log("Disconnecting socket");
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
