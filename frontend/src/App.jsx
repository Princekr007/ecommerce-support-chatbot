import { useState, useEffect } from "react";
import { ChatProvider } from "./context/ChatProvider";
import UserLogin from "./components/UserLogin";
import SessionManager from "./components/SessionManager";
import ChatWindow from "./components/ChatWindow";
import { useChat } from "./context/useChat";

// Component to sync user between App and ChatProvider
function UserSyncComponent({ currentUser }) {
  const { setUser } = useChat();
  
  useEffect(() => {
    if (currentUser) {
      console.log("🔄 Syncing user to ChatProvider:", currentUser);
      setUser(currentUser);
    }
  }, [currentUser, setUser]);
  
  return null;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);

  // On mount, check for existing user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("chat_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("🔄 Loading user from App localStorage:", parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("chat_user");
      }
    }
  }, []);

  const handleUserSelected = (user) => {
    console.log("👤 User selected in App:", user);
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
      <UserSyncComponent currentUser={currentUser} />
      <div className="min-h-screen bg-gray-50">
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
            onSessionChange={handleSessionSelected}
            onLogout={handleLogout}
          />
        )}
      </div>
    </ChatProvider>
  );
}

export default App;
