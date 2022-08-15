import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    "assets/styles/main.scss",
    "assets/styles/reset.scss",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  modules: ["@nuxtjs/color-mode", "@nuxtjs/supabase"],
  publicRuntimeConfig: {
    UNSPLASH_API_KEY: process.env.UNSPLASH_API_KEY,
  },
  meta: {
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  alias: {
    yup: "yup/lib/index.js",
  },
  build: {
    transpile: [
      "@fortawesome/vue-fontawesome",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-solid-svg-icons",
    ],
  },
});
