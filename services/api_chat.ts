import type { Database } from "~~/lib/database.types";
import { Message } from "~~/models/chat";

export default () => {
  const client = useSupabaseClient<Database>();

  const createChat = async () => {
    const { data: chat, error } = await client
      .from("chatrooms")
      .insert({})
      .select();

    if (error) throw error;

    return chat[0];
  };

  const createMessage = async (
    senderId: string,
    receiverId: string,
    message: string
  ) => {
    console.log({ senderId, receiverId });

    const { data, error } = await client
      .from("messages")
      .select("chatroom_id")
      .or(
        `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
      );

    let chatId = data?.length ? data[0].chatroom_id : null;

    if (error) throw error;

    if (!chatId) {
      const chat = await createChat();
      chatId = chat.id;
    }

    const { data: msg, error: messError } = await client
      .from("messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        chatroom_id: chatId,
        message,
      })
      .select();

    if (messError) throw messError;

    return msg[0];
  };

  const getChatrooms = async (userId: string) => {
    const { data: chats, error }: { data: any; error: any } = await client
      .rpc("get_chatrooms", { user_id: userId })
      .select(`*`);

    if (error) throw error;

    console.log({ chats });
    return chats.map((chats: any) => chats["chat"]) as Message[];
  };

  const readMessage = async (messageId: string, receiverId: string) => {
    const { data: message, error } = await client
      .from("messages")
      .update({ status: "read" })
      .eq("status", "unread")
      .eq("receiver_id", receiverId)
      .eq("id", messageId);

    if (error) return error;

    console.log({ message });

    return message;
  };

  const readMessages = async (receiverId: string, chatroomId: string) => {
    const { data: messages, error } = await client
      .from("messages")
      .update({ status: "read" })
      .eq("status", "unread")
      .eq("receiver_id", receiverId)
      .eq("chatroom_id", chatroomId);

    if (error) return error;

    return messages;
  };

  const getMessages = async (chatroomId: string, receiverId: string) => {
    const { data: messages, error } = await client
      .from("messages")
      .select(
        `
        *,
        sender:sender_id ( * ),
        receiver:receiver_id ( * )
      `
      )
      .eq("chatroom_id", chatroomId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const unreadMsgs = messages.filter(
      (msg) => msg.status === "unread" && receiverId === msg.receiver_id
    );
    console.log({ unreadMsgs });
    if (unreadMsgs.length) await readMessages(receiverId, chatroomId);

    console.log({ messages });

    return messages;
  };

  const deleteMessage = async (messageId: number) => {
    console.log({ messageId });
    const { data: message, error } = await client
      .from("messages")
      .update({ status: "deleted", updated_at: new Date() })
      .eq("id", messageId)
      .select();

    if (error) throw error;

    return message[0];
  };

  return {
    createMessage,
    getChatrooms,
    readMessage,
    getMessages,
    deleteMessage,
  };
};
