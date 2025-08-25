import React, { useState, useCallback } from "react";
import { ChatContext } from "./ChatContext";

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sessions, setSessions] = useState([]);

    const API_BASE = import.meta.env.VITE_API_BASE || '';

  // Initialize user from localStorage on provider mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem("chat_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("🔄 Loading user from localStorage:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("chat_user");
      }
    }
  }, []);

  const fetchSessions = useCallback(async (userId = null) => {
    try {
      let url = `${API_BASE}/api/chat/sessions/`;
      if (userId) {
        url += `?user_id=${userId}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setSessions([]);
    }
  }, [API_BASE]);

  const fetchMessages = useCallback(async (sid) => {
    if (!sid) return;
    try {
      console.log("Fetching messages for session:", sid);
      const res = await fetch(`${API_BASE}/api/chat/sessions/${sid}/messages`);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched messages:", data);
        setMessages(data);
      } else {
        console.error("Failed to fetch messages:", res.status);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [API_BASE]);

  const sendMessage = useCallback(async (messageContent) => {
    console.log("📤 Calling sendMessage...", { user, sessionId, messageContent });
    
    if (!user || !sessionId || !messageContent.trim()) {
      console.error("Missing user, session, or message content", {
        user,
        sessionId,
        messageContent,
      });
      return;
    }

    console.log("Sending message to /api/chat/:", {
      user_id: user.id,
      session_id: sessionId,
      message: messageContent,
    });

    setLoading(true);

    // Optimistic UI
    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      sender: "user",
      content: messageContent,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await fetch(`${API_BASE}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          session_id: sessionId,
          message: messageContent,
        }),
      });

      console.log("Response status:", response.status);
      if (response.ok) {
        await fetchMessages(sessionId);
      } else {
        console.error("Failed to send message:", response.status, response.statusText);
        // remove optimistic message
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
        // show error message
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            session_id: sessionId,
            sender: "ai",
            content: "Sorry, I'm having trouble responding right now. Please try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Network error sending message:", error);
      // remove optimistic message
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
      // show error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          session_id: sessionId,
          sender: "ai",
          content: "Network error. Please check your connection and try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user, sessionId, fetchMessages, API_BASE]);

  // Add function to sync user from App component
  const updateUser = useCallback((newUser) => {
    console.log("👤 Updating user in context:", newUser);
    setUser(newUser);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser: updateUser, // Use the new updateUser function
        sessionId,
        setSessionId,
        messages,
        setMessages,
        loading,
        setLoading,
        inputValue,
        setInputValue,
        sessions,
        setSessions,
        fetchSessions,
        fetchMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
