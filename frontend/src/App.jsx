// src/App.jsx - Updated with proper flow and Tailwind styling
import { useState, useEffect } from "react";
import { ChatProvider } from "./context/ChatProvider";
import UserLogin from "./components/UserLogin";
import SessionManager from "./components/SessionManager";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);

  // On mount, check for existing user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("chat_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("chat_user");
      }
    }
  }, []);

  const handleUserSelected = (user) => {
    setCurrentUser(user);
    setCurrentSession(null);
    localStorage.setItem("chat_user", JSON.stringify(user));
  };

  const handleSessionSelected = (session) => {
    setCurrentSession(session);
  };

  const handleLogout = () => {
    localStorage.removeItem("chat_user");
    setCurrentUser(null);
    setCurrentSession(null);
  };

  return (
    <ChatProvider>
      <div className="font-sans antialiased">
        {!currentUser ? (
          <UserLogin onUserSelected={handleUserSelected} />
        ) : !currentSession ? (
          <SessionManager 
            user={currentUser} 
            onSessionSelected={handleSessionSelected} 
            onLogout={handleLogout} 
          />
        ) : (
          <ChatWindow 
            user={currentUser} 
            session={currentSession} 
            onSessionChange={setCurrentSession} 
            onLogout={handleLogout} 
          />
        )}
      </div>
    </ChatProvider>
  );
}

export default App;