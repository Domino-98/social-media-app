import { Pin } from "~~/models/pin";

export const usePins = () => {
  const client = useSupabaseClient();
  let pins = ref<Pin[]>();
  let pinsLoading = ref<boolean>();

  const fetchAllPins = async () => {
    pinsLoading.value = true;
    try {
      const { data, error } = await client.from<Pin>("pins").select(`
            *,
            author:profiles (
              id,
              profile_id,
              avatar_url,
              username,
              full_name
            )
          `);

      if (error) throw error;

      pins.value = data;
    } catch (error) {
    } finally {
      pinsLoading.value = false;
    }
  };

  const fetchUserPins = async (userId: string) => {
    pinsLoading.value = true;
    try {
      const { data, error } = await client
        .from<Pin>("pins")
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
        .match({ user_id: userId });

      console.log(userId);

      if (error) throw error;

      pins.value = data;

      console.log(data);
    } catch (error) {
    } finally {
      pinsLoading.value = false;
    }
  };

  const fetchSavedPins = async (userId: string) => {
    pinsLoading.value = true;
    try {
      const { data, error } = await client
        .from("saved")
        .select(
          `
            pin:pins (
              *,
              author:profiles (
                id,
                profile_id,
                avatar_url,
                username,
                full_name
              )
            )
          `
        )
        .match({ user_id: userId });

      console.log(data);

      if (error) throw error;

      pins.value = data.map((pin) => {
        return pin["pin"];
      });
      console.log(pins.value);
    } catch (error) {
    } finally {
      pinsLoading.value = false;
    }
  };

  const addToSaved = async (pinId: number, userId: string) => {
    try {
      const { data, error } = await client.from("saved").insert({
        pin_id: pinId,
        user_id: userId,
      });

      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromSaved = async (pinId: number, userId: string) => {
    try {
      const { data, error } = await client
        .from("saved")
        .delete()
        .match({ pin_id: pinId, user_id: userId });

      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  const isPinSaved = async (
    pinId: number,
    userId: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await client
        .from("saved")
        .select()
        .match({ pin_id: pinId, user_id: userId });

      if (error) throw error;

      return !!data.length;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    fetchAllPins,
    fetchUserPins,
    fetchSavedPins,
    addToSaved,
    removeFromSaved,
    isPinSaved,
    pins,
    pinsLoading,
  };
};
