import { Comment } from "~~/models/comment";

export default () => {
  const client = useSupabaseClient();

  const fetchComments = async (pinId: number) => {
    const { data: comments, error } = await client
      .from<Comment>("comments")
      .select(
        `
      *,
      author:profiles (
        id,
        profile_id,
        avatar_url,
        username,
        full_name
      )
    `
      )
      .order("created_at")
      .match({ pin_id: pinId });

    console.log(comments);

    if (error) throw error;

    return comments;
  };

  const addComment = async (message: string, pinId: number) => {
    const { data: comment, error } = await client.from("comments").insert({
      message: message,
      pin_id: pinId,
      user_id: client.auth.user().id,
    });

    console.log(comment);

    if (error) throw error;

    return comment;
  };

  const editComment = async (message: string, commentId: number) => {
    const { data, error } = await client
      .from("comments")
      .update({ message, updated_at: new Date() })
      .match({ id: commentId });

    if (error) throw error;
  };

  const deleteComment = async (commentId: number) => {
    const { data, error } = await client
      .from("comments")
      .delete()
      .match({ id: commentId });

    if (error) throw error;
  };

  return {
    fetchComments,
    addComment,
    editComment,
    deleteComment,
  };
};
