// src/context/useChat.js
import { useContext } from "react";
import { ChatContext } from "./ChatContext";

export const useChat = () => useContext(ChatContext);
