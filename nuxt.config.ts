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
  ],
  css: ["~/assets/css/main.css"],

  nitro: {
    preset: "firebase",
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
