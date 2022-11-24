export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          image_url: string;
          slug: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          image_url: string;
          slug: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          image_url?: string;
          slug?: string;
        };
      };
      chatrooms: {
        Row: {
          id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: number;
          created_at: string;
          message: string;
          pin_id: number;
          user_id: string;
          updated_at: string | Date;
        };
        Insert: {
          id?: number;
          created_at?: string;
          message: string;
          pin_id: number;
          user_id: string;
          updated_at?: string | Date;
        };
        Update: {
          id?: number;
          created_at?: string;
          message?: string;
          pin_id?: number;
          user_id?: string;
          updated_at?: string | Date;
        };
      };
      messages: {
        Row: {
          id: number;
          created_at: string;
          chatroom_id: string;
          sender_id: string;
          message: string;
          receiver_id: string;
          status: string;
          updated_at: string | Date;
        };
        Insert: {
          id?: number;
          created_at?: string;
          chatroom_id: string;
          sender_id: string;
          message: string;
          receiver_id: string;
          status?: string;
          updated_at?: string | Date;
        };
        Update: {
          id?: number;
          created_at?: string;
          chatroom_id?: string;
          sender_id?: string;
          message?: string;
          receiver_id?: string;
          status?: string;
          updated_at?: string | Date;
        };
      };
      notifications: {
        Row: {
          id: number;
          created_at: string;
          notifier_id: string;
          recipent_id: string;
          notification_content: string;
          status: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          notifier_id: string;
          recipent_id: string;
          notification_content: string;
          status?: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          notifier_id?: string;
          recipent_id?: string;
          notification_content?: string;
          status?: string;
        };
      };
      pins: {
        Row: {
          id: number;
          created_at: string;
          title: string;
          description: string | null;
          pin_url: string;
          user_id: string;
          destination_url: string | null;
          category_id: number;
        };
        Insert: {
          id?: number;
          created_at?: string;
          title: string;
          description?: string | null;
          pin_url: string;
          user_id: string;
          destination_url?: string | null;
          category_id: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          title?: string;
          description?: string | null;
          pin_url?: string;
          user_id?: string;
          destination_url?: string | null;
          category_id?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | Date;
          username: string;
          avatar_url: string | null;
          website: string | null;
          background_url: string | null;
          bio: string | null;
          full_name: string | null;
          email: string;
          profile_id: number;
        };
        Insert: {
          id: string;
          updated_at: string | Date;
          username: string;
          avatar_url?: string | null;
          website?: string | null;
          background_url?: string | null;
          bio?: string | null;
          full_name?: string | null;
          email: string;
          profile_id?: number;
        };
        Update: {
          id?: string;
          updated_at?: string | Date;
          username?: string;
          avatar_url?: string | null;
          website?: string | null;
          background_url?: string | null;
          bio?: string | null;
          full_name?: string | null;
          email?: string;
          profile_id?: number;
        };
      };
      relations: {
        Row: {
          id: number;
          created_at: string;
          follower_id: string;
          following_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          follower_id: string;
          following_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          follower_id?: string;
          following_id?: string;
        };
      };
      saved: {
        Row: {
          id: number;
          created_at: string;
          user_id: string;
          pin_id: number;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id: string;
          pin_id: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: string;
          pin_id?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_chatrooms: {
        Args: { user_id: string };
        Returns: Json;
      };
      get_following_pins: {
        Args: { followerid: string };
        Returns: Json;
      };
      random_string: {
        Args: { length: number };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
