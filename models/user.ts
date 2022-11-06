export type User = {
  id: string;
  avatar_url?: string;
  full_name: string;
  username: string;
  bio?: string;
  website?: string;
  background_url?: string;
  email: string;
  profile_id: number;
};

export type UserToUpdate = Partial<User>;
