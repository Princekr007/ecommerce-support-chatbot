// src/components/UserLogin.jsx - Supports both email and user ID with Tailwind CSS
import { useState } from "react";

const UserLogin = ({ onUserSelected }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const [creating, setCreating] = useState(false);

  // Detect if input is email or user ID
  const detectInputType = (value) => {
    if (value.includes("@")) {
      return "email";
    } else if (/^\d+$/.test(value)) {
      return "user_id";
    } else {
      return "unknown";
    }
  };

  const handleLogin = async () => {
    setUserNotFound(false);
    setError("");
    
    if (!input.trim()) {
      setError("Please enter your email or user ID");
      return;
    }

    setLoading(true);
    const inputType = detectInputType(input.trim());
    
    try {
      let response;
      
      if (inputType === "email") {
        response = await fetch(`/api/chat/users/by-email/${encodeURIComponent(input.trim())}`);
      } else if (inputType === "user_id") {
        response = await fetch(`/api/chat/users/${input.trim()}`);
      } else {
        setError("Please enter a valid email address or numeric user ID");
        setLoading(false);
        return;
      }

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("chat_user", JSON.stringify(user));
        onUserSelected(user);
      } else if (response.status === 404) {
        setUserNotFound(true);
      } else {
        setError("Failed to login. Please try again.");
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    const inputType = detectInputType(input.trim());
    
    if (inputType !== "email") {
      setError("Can only create new users with email address");
      return;
    }

    setError("");
    setCreating(true);
    
    try {
      const res = await fetch("/api/chat/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: input.split("@")[0],
          email: input.trim(),
        }),
      });
      
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem("chat_user", JSON.stringify(user));
        onUserSelected(user);
      } else {
        setError("Failed to create user. Please try again.");
      }
    } catch (err) {
      setError("Failed to create user. Please try again.");
      console.error("Create user error:", err);
    } finally {
      setCreating(false);
    }
  };

  const inputType = detectInputType(input);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Support Chat</h2>
          <p className="text-gray-600">Enter your email address or user ID to access support</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter your email or user ID"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              disabled={loading || creating}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            
            {input && (
              <div className="flex items-center mt-2 text-sm">
                {inputType === "email" && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Email format detected
                  </div>
                )}
                {inputType === "user_id" && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    User ID format detected
                  </div>
                )}
                {inputType === "unknown" && (
                  <div className="flex items-center text-amber-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Please enter a valid email or numeric user ID
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogin} 
            disabled={loading || creating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : "Login"}
          </button>
          
          {userNotFound && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <p className="text-amber-800 font-medium">User not found</p>
              {inputType === "email" ? (
                <>
                  <p className="text-amber-700 text-sm">Would you like to create a new account with this email?</p>
                  <button 
                    onClick={handleCreateUser} 
                    disabled={creating}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-sm"
                  >
                    {creating ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </div>
                    ) : "Create User"}
                  </button>
                </>
              ) : (
                <p className="text-amber-700 text-sm">Please check your user ID or try logging in with your email instead.</p>
              )}
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;