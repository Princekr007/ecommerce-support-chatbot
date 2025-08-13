import { useEffect } from "react";
import { useChat } from "../context/useChat";

const StartupInitializer = () => {
  const { setUser, setSessionId, fetchSessions } = useChat();

  useEffect(() => {
    const initialize = async () => {
      try {
        let user = JSON.parse(localStorage.getItem("chat_user"));

        if (!user) {
          const userRes = await fetch("/api/chat/users/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Guest",
              email: `guest_${Date.now()}@example.com`,
            }),
          });
          if (!userRes.ok) throw new Error(`Failed to create user: ${userRes.status}`);
          user = await userRes.json();
          localStorage.setItem("chat_user", JSON.stringify(user));
        }

        setUser(user);

        const sessionRes = await fetch("/api/chat/sessions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        if (!sessionRes.ok) throw new Error(`Failed to create session: ${sessionRes.status}`);
        const sessionData = await sessionRes.json();
        setSessionId(sessionData.id);

        await fetchSessions(user.id);
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };

    initialize();
  }, [setUser, setSessionId, fetchSessions]);

  return null;
};

export default StartupInitializer;
