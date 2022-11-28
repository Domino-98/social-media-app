import { Notification } from "~~/models/notification";

export const useNotifications = () => {
  const notifications = useState<Notification[]>("notifications", () => []);
  const totalNotifications = useState<number>("totalNotifications", () => 0);

  return {
    notifications,
    totalNotifications,
  };
};
