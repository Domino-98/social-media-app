import type { Database } from "~~/lib/database.types";

export default () => {
  const client = useSupabaseClient<Database>();

  const followUser = async (followerId: string, followingId: string) => {
    const { data, error } = await client
      .from("relations")
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) throw error;
  };

  const unfollowUser = async (followerId: string, followingId: string) => {
    const { data, error } = await client
      .from("relations")
      .delete()
      .match({ follower_id: followerId, following_id: followingId });

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

  const fetchFollowingPins = async (userId: string) => {
    console.log({ userId });

    const { data: pins, error } = await client
      .rpc("get_following_pins", {
        followerid: userId,
      })
      .select("*");

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
