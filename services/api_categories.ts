export default () => {
  const client = useSupabaseClient();

  const fetchCategories = async () => {
    const { data: categories, error } = await client
      .from("categories")
      .select("id, name, slug, image_url")
      .order("created_at");

    if (error) throw error;

    return categories;
  };

  const fetchPinsByCategory = async (slug: string) => {
    console.log(slug);
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
      .order("created_at", { ascending: false });

    console.log(pins);
    if (error) throw error;

    return pins;
  };

  return {
    fetchCategories,
    fetchPinsByCategory,
  };
};
