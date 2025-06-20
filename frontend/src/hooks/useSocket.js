import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

export const useSocket = () => {
  const socketRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection
    socketRef.current = io(import.meta.env.REACT_APP_SOCKET_URL, {
      auth: { token },
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  const joinConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit("joinConversation", conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit("leaveConversation", conversationId);
    }
  };

  const onNewMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("newMessage", callback);
    }
  };

  const onConversationClosed = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("conversationClosed", callback);
    }
  };

  const onNewConversation = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("newConversation", callback);
    }
  };

  const removeListeners = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
    }
  };

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    onNewMessage,
    onConversationClosed,
    onNewConversation,
    removeListeners,
  };
};
