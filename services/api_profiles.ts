import { User, UserToUpdate } from "~~/models/user";

export default () => {
  const client = useSupabaseClient();

  const getUser = async (profileId: number) => {
    const { data: profile, error } = await client
      .from<User>("profiles")
      .select()
      .match({ profile_id: profileId })
      .single();

    if (error) throw error;

    return profile;
  };

  const getCurrentUser = async (userId: string) => {
    const { data: profile, error } = await client
      .from<User>("profiles")
      .select()
      .match({ id: userId })
      .single();

    if (error) throw error;

    return profile;
  };

  const updateUser = async (userId: string, userInfo: UserToUpdate) => {
    const { error: updateError } = await client
      .from("profiles")
      .update({
        updated_at: new Date(),
        ...userInfo,
      })
      .match({ id: userId });

    if (updateError) return updateError;
  };

  return {
    getUser,
    getCurrentUser,
    updateUser,
  };
};
