import type { Database } from "~~/lib/database.types";
import { User } from "~~/models/user";
import notificationsApi from "./api_notifications";

export default () => {
  const client = useSupabaseClient<Database>();

  const followUser = async (
    followerId: string,
    followingId: string,
    user: User
  ) => {
    const { data, error } = await client
      .from("relations")
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) throw error;

    const notificationContent = `<a href="/profile/${user.profile_id}"><span class="notifications__text">Użytkownik <b>${user.username}</b> zaczął Cię obserwować!</span></a>`;

    if (followerId !== followingId)
      await notificationsApi().sendNotification(
        followerId,
        followingId,
        notificationContent
      );
  };

  const unfollowUser = async (followerId: string, followingId: string) => {
    const { data, error } = await client
      .from("relations")
      .delete()
      .match({ follower_id: followerId, following_id: followingId })
      .select();

    if (error) throw error;
  };

  const getTotalFollowing = async (userId: string) => {
    const { data: totalFollowing, error } = await client
      .from("relations")
      .select("*", { count: "exact" })
      .match({ follower_id: userId });

    if (error) throw error;

    return totalFollowing.length;
  };

  const getTotalFollowers = async (userId: string) => {
    const { data: totalFollowers, error } = await client
      .from("relations")
      .select("*", { count: "exact" })
      .match({ following_id: userId });

    if (error) throw error;

    return totalFollowers.length;
  };

  const checkIfFollowing = async (followerId: string, followingId: string) => {
    const { data: follows, error } = await client
      .from("relations")
      .select("*")
      .match({ follower_id: followerId, following_id: followingId });

    if (error) throw error;

    if (follows.length) return true;
    return false;
  };

  const fetchFollowingPins = async (userId: string, from = 0, to = 23) => {
    const { data: pins, error } = await client
      .rpc("get_following_pins", {
        followerid: userId,
      })
      .select("*")
      .range(from, to);

    if (error) throw error;

    return pins.map((pin) => pin["following"]);
  };

  return {
    followUser,
    unfollowUser,
    getTotalFollowers,
    getTotalFollowing,
    checkIfFollowing,
    fetchFollowingPins,
  };
};
