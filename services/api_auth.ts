import type { Database } from "~~/lib/database.types";
export default () => {
  const client = useSupabaseClient<Database>();

  const registerUser = async (
    email: string,
    password: string,
    username: string
  ) => {
    const { data: foundUsername, error } = await client
      .from("profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (error) throw error;

    if (foundUsername) {
      throw new Error("Podana nazwa użytkownika już istnieje");
    }

    const { error: signupError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (signupError) throw signupError;
  };

  const loginUser = async (email: string, password: string) => {
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  return {
    registerUser,
    loginUser,
  };
};
