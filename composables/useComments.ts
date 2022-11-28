import { Comment } from "~~/models/comment";

export const useComments = () => {
  const comments = useState<Comment[]>("comments", () => []);
  const totalComments = useState<number>("totalComments", () => 0);

  return {
    comments,
    totalComments,
  };
};
