// src/context/ChatProvider.jsx - Fixed message sending and refreshing
import React, { useState } from "react";
import { ChatContext } from "./ChatContext";

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sessions, setSessions] = useState([]);

  // Fetch sessions with user filtering
  const fetchSessions = async (userId = null) => {
    try {
      let url = "http://localhost:8000/api/chat/sessions/";
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
  };

  // Send message with proper flow
  const sendMessage = async (messageContent) => {
    if (!user || !sessionId || !messageContent.trim()) {
      console.error("Missing user, session, or message content");
      return;
    }

    console.log("Sending message to /api/chat/:", {user_id: user.id, session_id: sessionId, message: messageContent});
    
    setLoading(true);
    
    // Optimistically add user message to UI
    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      sender: "user",
      content: messageContent,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          session_id: sessionId,
          message: messageContent
        }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Response data:", result);
        
        // Refresh all messages to get the real user message and AI response
        await fetchMessages(sessionId);
      } else {
        console.error("Failed to send message:", response.status, response.statusText);
        
        // Remove the optimistic message if sending failed
        setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
        
        // Show error message
        const errorMessage = {
          id: `error-${Date.now()}`,
          session_id: sessionId,
          sender: "ai",
          content: "Sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Network error sending message:", error);
      
      // Remove the optimistic message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
      
      // Show error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        session_id: sessionId,
        sender: "ai",
        content: "Network error. Please check your connection and try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a session
  const fetchMessages = async (sessionId) => {
    if (!sessionId) return;
    
    try {
      console.log("Fetching messages for session:", sessionId);
      const res = await fetch(`http://localhost:8000/api/chat/sessions/${sessionId}/messages`);
      
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
        setSessions,
        fetchSessions,
        sendMessage,
        fetchMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};