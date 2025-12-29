// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-vue3-google-signin",
  ],
  css: ["~/assets/css/main.css"],

  googleSignIn: {
    clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  },

  runtimeConfig: {
    public: {
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },

  nitro: {
    preset: "firebase",
  },

  routeRules: {
    "/backend/**": {
      // proxy: "https://p66-novelrent.csmsu.net/**",
      proxy: "http://localhost:8888/**",
    },
  },
  //  nitro: {
  //   devProxy: {
  //     '/api': {
  //       target: 'http://localhost:8888',
  //       changeOrigin: true,
  //       prependPath: true,
  //     }
  //   }
  // },

  // // หรือใช้ routeRules
  // routeRules: {
  //   '/api/**': {
  //     proxy: 'http://localhost:8888/**'
  //   }
  // }
});
