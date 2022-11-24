import { Message } from "~~/models/chat";

export const useMessages = () => {
  const chats = useState<Message[]>("chats", () => []);
  const messages = useState<Message[]>("messages", () => []);

  return {
    chats,
    messages,
  };
};
