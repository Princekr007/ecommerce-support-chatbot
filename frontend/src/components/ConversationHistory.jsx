import { useChat } from "../context/useChat";

const ConversationHistory = () => {
  const { conversations, loadConversation } = useChat();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Conversation History</h2>
      {!Array.isArray(conversations) || conversations.length === 0 ? (
        <p className="text-sm text-gray-500">No conversations yet.</p>
      ) : (
        <ul className="space-y-2">
          {conversations.map((convo) => (
            <li key={convo.id}>
              <button
                className="w-full text-left text-sm text-blue-600 hover:underline"
                onClick={() => loadConversation(convo.id)}
              >
                {convo.id}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationHistory;
