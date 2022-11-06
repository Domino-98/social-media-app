import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import "dayjs/locale/pl.js";

export default defineNuxtPlugin((nuxtApp) => {
  dayjs.extend(relativeTime);
  dayjs.locale("pl");
  nuxtApp.provide("dayjs", dayjs);
});
