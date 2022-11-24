import type { User } from "~~/models/user";

export type Message = {
  id: number;
  message: string;
  created_at: string;
  updated_at: string | Date;
  chatroom_id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  sender?: User | null;
  receiver?: User | null;
};
