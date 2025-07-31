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
          const userRes = await fetch("http://localhost:8000/api/chat/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Guest",
              email: `guest_${Date.now()}@example.com`,
            }),
          });
          user = await userRes.json();
          localStorage.setItem("chat_user", JSON.stringify(user));
        }

        setUser(user);

        const sessionRes = await fetch("http://localhost:8000/api/chat/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
          }),
        });

        const sessionData = await sessionRes.json();
        setSessionId(sessionData.id);

        fetchSessions();
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };

    initialize();
  }, [setUser, setSessionId, fetchSessions]);

  return null; // This component doesn't render UI
};

export default StartupInitializer;
