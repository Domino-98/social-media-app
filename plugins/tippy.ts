import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css"; // optional for styling
import "tippy.js/dist/svg-arrow.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    VueTippy,
    // optional
    {
      directive: "tippy",
      component: "tippy", // => <tippy/>
      componentSingleton: "tippy-singleton", // => <tippy-singleton/>,
      defaultProps: {
        placement: "bottom",
        allowHTML: true,
        delay: [300, null],
        theme: "custom",
        arrow: false,
      }, // => Global default options * see all props
    }
  );
});
