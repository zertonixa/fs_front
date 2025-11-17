import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/shared/config/styles/colors" as colors;
          @use "@/shared/config/styles/mixin" as mixins;
        `,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@entities": "/src/entities",
      "@features": "/src/features",
      "@pages": "/src/pages",
      "@shared": "/src/shared",
      "@widgets": "/src/widgets",
    },
  },
});
