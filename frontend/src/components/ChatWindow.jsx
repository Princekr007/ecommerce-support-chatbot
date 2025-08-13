import { useEffect, useState, useCallback } from "react";
import MessageList from "./MessageList";
import UserInput from "./UserInput";
import ConversationHistory from "./ConversationHistory";
import { useChat } from "../context/useChat";

export default function ChatWindow({ user, session, onSessionChange, onLogout }) {
  const { fetchMessages, messages, setSessionId } = useChat();
  const [showHistory, setShowHistory] = useState(false);

  // Simplified - only fetch messages when session changes
  const memoizedFetchMessages = useCallback(() => {
    if (session?.id) {
      console.log("Setting session ID in context:", session.id);
      setSessionId(session.id);
      fetchMessages(session.id);
    }
  }, [session?.id, setSessionId, fetchMessages]);

  useEffect(() => {
    memoizedFetchMessages();
  }, [memoizedFetchMessages]);

  // Debug logging
  useEffect(() => {
    console.log("ChatWindow props:", { user, session });
    console.log("Current messages:", messages);
  }, [user, session, messages]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col min-h-0"> {/* Added min-h-0 for proper flex behavior */}
        {/* Header - Fixed at top */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Session ID: {session?.id} • {user?.name || user?.first_name || user?.email}
            </h1>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {showHistory ? "Hide" : "Show"} History
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSessionChange(null)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Sessions
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages - Scrollable area */}
        <div className="flex-1 bg-white min-h-0"> {/* Added min-h-0 for proper scrolling */}
          <MessageList sessionId={session?.id} />
        </div>

        {/* Input - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          <UserInput sessionId={session?.id} user={user} />
        </div>
      </div>

      {/* History Sidebar - Also scrollable */}
      {showHistory && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <ConversationHistory
              user={user}
              onSessionChange={onSessionChange}
              currentSession={session}
            />
          </div>
        </div>
      )}
    </div>
  );
}
