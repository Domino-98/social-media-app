import type { User } from "~~/models/user";
import type { Pin } from "~~/models/pin";
import type { Database } from "~~/lib/database.types";
import notificationsApi from "./api_notifications";

export default () => {
  const client = useSupabaseClient<Database>();

  const fetchComments = async (pinId: number) => {
    const { data: comments, error } = await client
      .from("comments")
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

  const addComment = async (
    message: string,
    pinId: number,
    pin: Pin,
    user: User
  ) => {
    const { data: comment, error } = await client
      .from("comments")
      .insert({
        message: message,
        pin_id: pinId,
        user_id: user.id!,
      })
      .select();

    console.log(comment);

    if (error) throw error;

    const notificationContent = `<a href="/pin/${pinId}" target="_self" onclick="event.preventDefault(); 
    router.push(/pin/${pinId});"><span class="notifications__text">Użytkownik <b>${user.username}</b> skomentował twojego pina <b>${pin.title}</b>!</span></a>`;

    await notificationsApi().sendNotification(
      user.id!,
      pin.author?.id!,
      notificationContent
    );

    return comment;
  };

  const editComment = async (message: string, commentId: number) => {
    console.log({ message, commentId });

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
