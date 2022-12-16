import type { Database } from "~~/lib/database.types";
import { Notification } from "~~/models/notification";

export default () => {
  const client = useSupabaseClient<Database>();

  const sendNotification = async (
    notifierId: string,
    recipentId: string,
    notificationContent: string
  ) => {

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

    return data;
  };

  const getNotifications = async (recipentId: string, from = 0, to = 5) => {
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
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return notifications as Notification[];
  };

  const getTotalNotifications = async (userId: string) => {
    const { count, error } = await client
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipent_id", userId);

    if (error) throw error;

    return count;
  };

  const deleteNotification = async (id: number) => {
    const { error } = await client.from("notifications").delete().eq("id", id);

    if (error) throw error;
  };

  const deleteAllNotifications = async (userId: string) => {
    const { error } = await client
      .from("notifications")
      .delete()
      .eq("recipent_id", userId);

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

    return notification;
  };

  return {
    sendNotification,
    getNotifications,
    getTotalNotifications,
    deleteNotification,
    deleteAllNotifications,
    readNotifications,
    readNotification,
  };
};
