import { Category } from "~~/models/category";

export const useCategories = () => {
  const categories = useState<Category[]>("categories", () => []);

  return {
    categories,
  };
};
