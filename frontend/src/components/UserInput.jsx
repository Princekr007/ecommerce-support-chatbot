import { useState } from "react";
import { useChat } from "../context/useChat";

export default function UserInput() {
  const [input, setInput] = useState("");
  const { sendMessage } = useChat();

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex border-t p-3 bg-white">
      <input
        type="text"
        className="flex-1 p-2 border rounded-l-md focus:outline-none"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="bg-blue-600 text-white px-4 rounded-r-md"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
