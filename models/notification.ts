export type Notification = {
  id: number;
  created_at: string;
  notifier_id: string;
  notifier?: {
    id?: string;
    avatar_url?: string;
    profile_id?: number;
  } | null;
  recipent_id?: string;
  notification_content: string;
  status: string;
};
