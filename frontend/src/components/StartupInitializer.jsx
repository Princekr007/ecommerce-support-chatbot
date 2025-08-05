// src/components/StartupInitializer.jsx
import { useEffect } from "react";
import { useChat } from "../context/useChat";

const StartupInitializer = () => {
  const { setUser, setSessionId, fetchSessions } = useChat();

  useEffect(() => {
    const initialize = async () => {
      try {
        let user = JSON.parse(localStorage.getItem("chat_user"));
        
        if (!user) {
          // FIXED: Correct endpoint path with trailing slash
          const userRes = await fetch("/api/chat/users/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Guest",
              email: `guest_${Date.now()}@example.com`,
            }),
          });

          if (!userRes.ok) {
            throw new Error(`Failed to create user: ${userRes.status}`);
          }
          
          user = await userRes.json();
          localStorage.setItem("chat_user", JSON.stringify(user));
        }

        setUser(user);

        // FIXED: Correct endpoint path with trailing slash
        const sessionRes = await fetch("/api/chat/sessions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
          }),
        });

        if (!sessionRes.ok) {
          throw new Error(`Failed to create session: ${sessionRes.status}`);
        }

        const sessionData = await sessionRes.json();
        setSessionId(sessionData.id);
        
        // Fetch sessions after creating one
        await fetchSessions();
        
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };

    initialize();
  }, [setUser, setSessionId, fetchSessions]);

  return null; // This component doesn't render UI
};

export default StartupInitializer;
