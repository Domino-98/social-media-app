import { Comment } from "~~/models/comment";

export const useComments = () => {
  const comments = useState<Comment[]>("comments", () => []);

  return {
    comments,
  };
};
