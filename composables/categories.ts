export const useCategories = () => {
  const categories = useState("categories", () => []);

  return {
    categories,
  };
};
