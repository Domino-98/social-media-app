import { PinToUpdate } from "./../models/pin";
import { Pin } from "~~/models/pin";

export default () => {
  const client = useSupabaseClient();

  const fetchAllPins = async () => {
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
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  };

  const fetchPinById = async (id: number) => {
    const { data: pin, error } = await client
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
          ),
          category:categories (
            id,
            name
          )
       `
      )
      .match({ id })
      .single();

    if (error) throw error;

    return pin;
  };

  const fetchUserPins = async (userId: string) => {
    const { data: pin, error } = await client
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

    if (error) throw error;

    return pin;
  };

  const fetchSavedPins = async (userId: string) => {
    const { data: pins, error } = await client
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

    if (error) throw error;

    return pins.map((pin) => {
      return pin["pin"];
    });
  };

  const addToSaved = async (pinId: number, userId: string) => {
    const { data, error } = await client.from("saved").insert({
      pin_id: pinId,
      user_id: userId,
    });

    if (error) throw error;
  };

  const removeFromSaved = async (pinId: number, userId: string) => {
    const { data, error } = await client
      .from("saved")
      .delete()
      .match({ pin_id: pinId, user_id: userId });

    if (error) throw error;
  };

  const isPinSaved = async (
    pinId: number,
    userId: string
  ): Promise<boolean> => {
    const { data, error } = await client
      .from("saved")
      .select()
      .match({ pin_id: pinId, user_id: userId });

    if (error) throw error;

    return !!data.length;
  };

  const addPin = async (
    imgFile: File,
    title: string,
    description: string,
    destination_url: string,
    category_id: number
  ) => {
    const { error: uploadError } = await client.storage
      .from("pins")
      .upload(`${client.auth.user().id}/${imgFile.name}`, imgFile);

    if (uploadError) throw new Error("Wystąpił błąd podczas przesyłania pliku");

    const { publicURL, error } = client.storage
      .from("pins")
      .getPublicUrl(`${client.auth.user().id}/${imgFile.name}`);

    if (error) throw new Error("Wystąpił błąd podczas pobierania adresu URL");

    console.log(publicURL);

    const { error: insertError } = await client.from("pins").insert({
      title: title,
      description: description,
      pin_url: publicURL,
      destination_url: destination_url,
      category_id,
      user_id: client.auth.user().id,
    });

    if (insertError) throw new Error("Wystąpił błąd podczas dodawania obrazu");
  };

  const editPin = async (id: number, pinToUpdate: PinToUpdate) => {
    const { data, error } = await client
      .from<Pin>("pins")
      .update({ ...pinToUpdate })
      .match({ id });

    if (error) throw error;
  };

  const deletePin = async (
    pinId: number,
    pinFileName: string,
    userId: string
  ) => {
    const { error } = await client.from("pins").delete().match({ id: pinId });

    if (error) throw error;

    const { error: storageError } = await client.storage
      .from("pins")
      .remove([`${userId}/${pinFileName}`]);

    if (storageError) throw error;
  };

  return {
    fetchAllPins,
    fetchPinById,
    fetchUserPins,
    fetchSavedPins,
    addToSaved,
    removeFromSaved,
    isPinSaved,
    addPin,
    editPin,
    deletePin,
  };
};
