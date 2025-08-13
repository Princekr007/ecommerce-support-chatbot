// src/components/UserInput.jsx - Fixed message sending flow
import { useState } from "react";
import { useChat } from "../context/useChat";

export default function UserInput({ sessionId, user }) {
  const [input, setInput] = useState("");
  const { sendMessage, loading } = useChat();

  const handleSend = async () => {
  console.log("🔄 handleSend called with:", { 
    input: input.trim(), 
    sessionId, 
    user: user?.id, 
    loading,
    sendMessage: typeof sendMessage 
  });

  if (!input.trim() || loading || !sessionId || !user) {
    console.log("❌ Send blocked:", { 
      hasInput: !!input.trim(), 
      loading, 
      hasSessionId: !!sessionId, 
      hasUser: !!user 
    });
    return;
  }
  
  const messageContent = input.trim();
  setInput("");

  try {
    console.log("📤 Calling sendMessage...");
    await sendMessage(messageContent);
    console.log("✅ sendMessage completed");
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    setInput(messageContent);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                loading 
                  ? "AI is responding..." 
                  : "Type your message here... (Press Enter to send)"
              }
              disabled={loading || !sessionId || !user}
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            
            {/* Character counter */}
            {input.length > 0 && (
              <div className="absolute bottom-1 right-14 text-xs text-gray-400">
                {input.length}/500
              </div>
            )}
          </div>
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || !sessionId || !user}
            className="flex-shrink-0 p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {!sessionId && <span className="text-amber-600">⚠ No session selected</span>}
            {!user && <span className="text-red-600">⚠ User not authenticated</span>}
            {loading && (
              <span className="text-blue-600 flex items-center">
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI is thinking...
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Press Enter to send</span>
            <span>•</span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}