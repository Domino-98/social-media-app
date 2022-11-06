export type Comment = {
  id: number;
  message: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  author: {
    id: string;
    avatar_url: string;
    username: string;
    full_name: string;
  };
};
