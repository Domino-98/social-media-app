import type { PinToUpdate } from "./../models/pin";
import type { Pin } from "~~/models/pin";
import type { User } from "~~/models/user";
import type { Database } from "~~/lib/database.types";
import notificationsApi from "./api_notifications";

export default () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const fetchAllPins = async () => {
    const { data: pins, error } = await client
      .from("pins")
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

    return pins;
  };

  const fetchPinById = async (id: number) => {
    const { data: pin, error } = await client
      .from("pins")
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
      .from("pins")
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

  const addToSaved = async (
    pinId: number,
    userId: string,
    recipentId: string,
    user: Partial<User>,
    pin: Pin
  ) => {
    const { data, error } = await client.from("saved").insert({
      pin_id: pinId,
      user_id: userId,
    });

    const notificationContent = `<a href="/pin/${pin.id}" target="_self" onclick="event.preventDefault(); 
    router.push(/pin/${pin.id});"><span class="notifications__text">Użytkownik <b>${user.username}</b> zapisał twojego pina <b>${pin.title}</b>!</span></a>`;

    await notificationsApi().sendNotification(
      userId,
      recipentId,
      notificationContent
    );

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
      .upload(`${user.value?.id}/${imgFile.name}`, imgFile);

    if (uploadError) throw new Error("Wystąpił błąd podczas przesyłania pliku");

    const {
      data: { publicUrl },
    } = client.storage
      .from("pins")
      .getPublicUrl(`${user.value?.id}/${imgFile.name}`);

    console.log(publicUrl);

    const { error: insertError } = await client
      .from("pins")
      .insert({
        title: title,
        description: description,
        pin_url: publicUrl,
        destination_url: destination_url,
        category_id,
        user_id: user.value?.id!,
      })
      .select();

    if (insertError) throw new Error("Wystąpił błąd podczas dodawania obrazu");
  };

  const editPin = async (id: number, pinToUpdate: PinToUpdate) => {
    const { data, error } = await client
      .from("pins")
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

  const searchPins = async (searchValue: string) => {
    const { data: pins, error } = await client
      .from("pins")
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
      .ilike("title", `%${searchValue}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return pins;
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
    searchPins,
  };
};
