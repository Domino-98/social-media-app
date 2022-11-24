import type { Database } from "~~/lib/database.types";

export default () => {
  const client = useSupabaseClient<Database>();

  const sendNotification = async (
    notifierId: string,
    recipentId: string,
    notificationContent: string
  ) => {
    console.log({ notifierId, recipentId });

    const { data, error } = await client
      .from("notifications")
      .upsert(
        {
          notifier_id: notifierId,
          recipent_id: recipentId,
          notification_content: notificationContent,
        },
        { onConflict: "recipent_id, notification_content" }
      )
      .select();

    if (error) throw error;

    console.log({ data });

    return data;
  };

  const getNotifications = async (recipentId: string) => {
    const { data: notifications, error } = await client
      .from("notifications")
      .select(
        `
        *,
        notifier:notifier_id (
          id,
          avatar_url,
          profile_id
        )
      `
      )
      .eq("recipent_id", recipentId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log({ notifications });

    return notifications;
  };

  const deleteNotification = async (id: number) => {
    const { error } = await client.from("notifications").delete().eq("id", id);

    if (error) throw error;
  };

  const readNotifications = async (recipentId: string) => {
    const { error } = await client
      .from("notifications")
      .update({ status: "read" })
      .eq("status", "unread")
      .eq("recipent_id", recipentId);

    if (error) throw error;
  };

  const readNotification = async (
    notificationId: number,
    recipentId: string
  ) => {
    const { data: notification, error } = await client
      .from("notifications")
      .update({ status: "read" })
      .eq("status", "unread")
      .eq("recipent_id", recipentId)
      .eq("id", notificationId);

    if (error) return error;

    console.log({ notification });

    return notification;
  };

  return {
    sendNotification,
    getNotifications,
    deleteNotification,
    readNotifications,
    readNotification,
  };
};
