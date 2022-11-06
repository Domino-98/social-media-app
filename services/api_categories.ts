export default () => {
  const client = useSupabaseClient();

  const fetchCategories = async () => {
    const { data: categories, error } = await client
      .from("categories")
      .select("id, name, image_url")
      .order("created_at");

    if (error) throw error;

    return categories;
  };

  return {
    fetchCategories,
  };
};
