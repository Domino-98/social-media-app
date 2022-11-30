export default defineNuxtConfig({
  css: [
    "assets/styles/main.scss",
    "assets/styles/reset.scss",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  modules: ["@nuxtjs/color-mode", "@nuxtjs/supabase"],
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
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap",
          crossorigin: "",
        },
      ],
    },
    pageTransition: {
      name: "fade",
      mode: "out-in", // default
    },
  },
  supabase: {
    client: {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    },
  },
});
