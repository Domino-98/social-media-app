export type Pin = {
  id: number;
  created_at: string;
  title: string;
  description?: string;
  pin_url: string;
  destination_url?: string;
  category_id: number;
  category?: {
    id: number;
    created_at: string;
    name: string;
    image_url: string;
    slug: string;
  } | null;
  author?: {
    id: string;
    profile_id: number;
    avatar_url: string;
    username: string;
    full_name: string;
  } | null;
};

export type PinToUpdate = {
  title: string;
  description?: string;
  destination_url?: string;
  category_id: number;
};
