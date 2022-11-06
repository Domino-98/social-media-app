export type Pin = {
  id: number;
  created_at: string;
  title: string;
  description?: string;
  pin_url: string;
  destination_url?: string;
  category: {
    id: number;
    name: string;
  };
  author: {
    id: string;
    profile_id: number;
    avatar_url: string;
    username: string;
    full_name: string;
  };
};

export type PinToUpdate = {
  title: string;
  description?: string;
  destination_url?: string;
  category_id: number;
};
