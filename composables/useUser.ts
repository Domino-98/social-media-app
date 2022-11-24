import { User } from "~~/models/user";

export const useUser = () =>
  useState<User | null>("user", () => ({
    id: "",
    avatar_url: "",
    full_name: "",
    username: "",
    bio: "",
    website: "",
    background_url: "",
    email: "",
    profile_id: 0,
    updated_at: "",
  }));
