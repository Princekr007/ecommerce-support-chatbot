// src/components/SessionManager.jsx - Enhanced with Tailwind CSS styling
import { useState, useEffect } from "react";
import { useChat } from "../context/useChat";

const SessionManager = ({ user, onSessionSelected, onLogout }) => {
  const { sessions, fetchSessions } = useChat();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSessions(user.id);
    }
  }, [user, fetchSessions]);

  const createNewSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/chat/sessions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: user.id, 
          title: "New Support Chat" 
        }),
      });
      
      if (response.ok) {
        const newSession = await response.json();
        onSessionSelected(newSession);
        await fetchSessions(user.id);
      } else {
        console.error("Failed to create session");
      }
    } catch (err) {
      console.error("Failed to create session:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectExistingSession = (session) => {
    onSessionSelected(session);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">User ID:</span> {user.id}</p>
                  <p><span className="font-medium">Name:</span> {user.name || user.first_name || "N/A"}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Sessions Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Chat Sessions</h2>
            <button 
              onClick={createNewSession} 
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Start New Chat
                </>
              )}
            </button>
          </div>
          
          {sessions.filter(s => s.user_id === user.id).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
              <p className="text-gray-600 mb-4">Start your first conversation with our support team</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions
                .filter(s => s.user_id === user.id)
                .map(session => (
                  <div
                    key={session.id}
                    onClick={() => selectExistingSession(session)}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 cursor-pointer transition-colors duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {session.title || "Untitled Chat"}
                      </h3>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Session ID: {session.id}</p>
                      <p className="mt-1">
                        Created: {new Date(session.created_at || session.started_at).toLocaleDateString()} at{" "}
                        {new Date(session.created_at || session.started_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionManager;