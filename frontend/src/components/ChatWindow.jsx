import MessageList from "./MessageList";
import UserInput from "./UserInput";
import ConversationHistory from "./ConversationHistory";


export default function ChatWindow() {
  return (
    <div className="flex h-screen">
      {/* Left Side Panel for Conversation History */}
      <ConversationHistory />

      {/* Main Chat Window */}
      <div className="flex flex-col flex-1 max-w-2xl mx-auto bg-white border rounded shadow-md">
        <header className="p-4 text-lg font-semibold border-b bg-blue-100 text-blue-900">
          🛍️ E-commerce Support Chat
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList />
        </div>
        <div className="p-4 border-t">
          <UserInput />
        </div>
      </div>
    </div>
  );
}
