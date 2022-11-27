import type { User } from "~~/models/user";
import type { Pin } from "~~/models/pin";
import type { Database } from "~~/lib/database.types";
import notificationsApi from "./api_notifications";

export default () => {
  const client = useSupabaseClient<Database>();

  const fetchComments = async (pinId: number, from = 0, to = 2, take = 2) => {
    const { data: fetchedComments, error } = await client
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
      .match({ pin_id: pinId })
      .range(from, to);

    if (error) throw error;

    console.log({ from, to, take });

    from = to + 1;
    to += take + 1;

    const { data: nextComments, error: nextError } = await client
      .from("comments")
      .select("*")
      .eq("pin_id", pinId)
      .range(from, to);

    if (nextError) throw error;

    return {
      fetchedComments,
      nextComments,
    };
  };

  const getTotalComments = async (pinId: number) => {
    const { count, error } = await client
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("pin_id", pinId);

    if (error) throw error;

    return count;
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

    const notificationContent = `<a href="/pin/${pinId}"><span class="notifications__text">Użytkownik <b>${user.username}</b> skomentował twojego pina <b>${pin.title}</b>!</span></a>`;

    if (user.id !== pin.author?.id)
      await notificationsApi().sendNotification(
        user.id,
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
    getTotalComments,
    addComment,
    editComment,
    deleteComment,
  };
};
