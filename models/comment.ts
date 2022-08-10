export type Comment = {
  id: number;
  message: string;
  author: {
    id: string;
    avatar_url: string;
    username: string;
    full_name: string;
  };
};
