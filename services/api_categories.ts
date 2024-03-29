import type { Database } from "~~/lib/database.types";
import { Category } from "~~/models/category";
import { Pin } from "~~/models/pin";

export default () => {
  const client = useSupabaseClient<Database>();

  const fetchCategories = async () => {
    const { data: categories, error } = await client
      .from("categories")
      .select("*")
      .order("created_at");

    if (error) throw error;

    return categories as Category[];
  };

  const fetchPinsByCategory = async (slug: string, from = 0, to = 23) => {
    const { data: pins, error } = await client
      .from("pins")
      .select(
        `*,
        categories!inner(*),
        author:profiles (
        id,
        profile_id,
        avatar_url,
        username,
        full_name
      )`
      )
      .eq("categories.slug", slug)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return pins as Pin[];
  };

  const fetchSimilarPins = async (
    pinId: number,
    categoryId: number,
    from = 0,
    to = 23
  ) => {
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
      .not("id", "eq", pinId)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return pins as Pin[];
  };

  return {
    fetchCategories,
    fetchPinsByCategory,
    fetchSimilarPins,
  };
};
