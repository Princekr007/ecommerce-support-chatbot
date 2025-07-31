import { useChat } from "../context/useChat";
import Message from "./Message";

export default function MessageList() {
  const { messages } = useChat();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
      {messages.map((msg, index) => (
        <Message key={index} from={msg.from} text={msg.text} />
      ))}
    </div>
  );
}
