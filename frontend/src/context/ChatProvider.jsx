// src/context/ChatProvider.jsx
import { useState } from "react";
import { ChatContext } from "./ChatContext";

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/chat/sessions");
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        sessionId,
        setSessionId,
        messages,
        setMessages,
        loading,
        setLoading,
        inputValue,
        setInputValue,
        sessions,
        fetchSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
