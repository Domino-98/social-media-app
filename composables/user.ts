import { User } from "~~/models/user";

export const useUser = () =>
  useState<User>("user", () => {
    let user = {
      id: null,
      avatar_url: "",
      full_name: "",
      username: "",
      bio: "",
      website: "",
      background_url: "",
      email: "",
      profile_id: null,
    };

    return user;
  });
