import dayjs from "dayjs";

export const useDateTime = () => {
  const timeFromNow = (value: string) => {
    const now = dayjs();
    const updatedAt = dayjs(value);
    const diff = updatedAt.diff(now);
    if (diff >= 0 || diff >= -5000) return "przed chwilą";
    return dayjs(value).fromNow();
  };

  return {
    timeFromNow,
  };
};
