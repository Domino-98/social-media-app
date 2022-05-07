import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["assets/styles/main.scss", "assets/styles/reset.scss"],
  modules: ["@nuxtjs/color-mode"],
  meta: {
    link: [
      {
        href: "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp",
        rel: "stylesheet",
      },
    ],
  },
});
