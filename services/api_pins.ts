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

  return {
    fetchAllPins,
    fetchPinById,
    fetchUserPins,
    addPin,
  };
};
