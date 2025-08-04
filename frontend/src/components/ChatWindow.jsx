// src/components/ChatWindow.jsx - Fixed session management
import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import UserInput from "./UserInput";
import ConversationHistory from "./ConversationHistory";
import { useChat } from "../context/useChat";

export default function ChatWindow({ user, session, onSessionChange, onLogout }) {
  const { fetchMessages, messages, setSessionId } = useChat();
  const [showHistory, setShowHistory] = useState(false);

  // Set session ID in context when session changes
  useEffect(() => {
    if (session && session.id) {
      console.log("Setting session ID in context:", session.id);
      setSessionId(session.id);
      fetchMessages(session.id);
    }
  }, [session, setSessionId, fetchMessages]);

  // Debug logging
  useEffect(() => {
    console.log("ChatWindow props:", { user, session });
    console.log("Current messages:", messages);
  }, [user, session, messages]);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversation History Sidebar */}
      <div className={`${showHistory ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
        <ConversationHistory 
          user={user} 
          onSessionChange={onSessionChange}
          currentSession={session}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {session?.title || "Support Chat"}
                </h1>
                <p className="text-sm text-gray-500">
                  Session ID: {session?.id} • {user?.name || user?.first_name || user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Online</span>
              </div>
              <button 
                onClick={onLogout}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <MessageList sessionId={session?.id} />
          <UserInput sessionId={session?.id} user={user} />
        </div>
      </div>
    </div>
  );
}