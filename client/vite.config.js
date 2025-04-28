// https://vitejs.dev/config/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  /*
  server: {
    proxy: {
      "/api": {
        target: "https://pfe-1back.onrender.com/api/",
        changeOrigin: true,
        secure: false,
      },
    },
  },*/
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/responsive.scss" as *;`,
      },
    },
  },
});
