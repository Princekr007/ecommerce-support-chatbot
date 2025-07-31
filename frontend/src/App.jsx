// src/App.jsx
import ChatWindow from "./components/ChatWindow";
import { ChatProvider } from "./context/ChatProvider";
import StartupInitializer from "./components/StartupInitializer";

function App() {
  return (
    <ChatProvider>
      <StartupInitializer />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}

export default App;
