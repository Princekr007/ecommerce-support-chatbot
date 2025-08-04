// src/components/ConversationHistory.jsx - Enhanced with Tailwind CSS styling
import { useChat } from "../context/useChat";

const ConversationHistory = ({ user, onSessionChange, currentSession }) => {
  const { sessions } = useChat();

  const userSessions = sessions.filter(s => s.user_id === user?.id) || [];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
        <p className="text-sm text-gray-600">{userSessions.length} conversations</p>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {userSessions.length === 0 ? (
          <div className="p-4 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {userSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionChange(session)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  currentSession?.id === session.id
                    ? 'bg-indigo-50 border-l-4 border-indigo-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${
                      currentSession?.id === session.id ? 'text-indigo-900' : 'text-gray-900'
                    }`}>
                      {session.title || "Untitled Chat"}
                    </h3>
                    <p className={`text-xs mt-1 ${
                      currentSession?.id === session.id ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {new Date(session.created_at || session.started_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {currentSession?.id === session.id && (
                    <div className="ml-2 flex-shrink-0">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 text-xs text-gray-400">
                  Session #{session.id}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span>Online • Ready to help</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory;