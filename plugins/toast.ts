import Toast, { PluginOptions, POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options: PluginOptions = {
  toastClassName: "custom-toast-style",
  bodyClassName: ["custom-toast-style"],
  position: POSITION.BOTTOM_CENTER,
  timeout: 2000,
  hideProgressBar: true,
  pauseOnHover: false,
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, options);
});
