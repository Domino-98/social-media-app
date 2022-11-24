import { Notification } from "~~/models/notification";

export const useNotifications = () => {
  const notifications = useState<Notification[]>("notifications", () => []);

  return {
    notifications,
  };
};
