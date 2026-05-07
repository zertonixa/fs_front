import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import Sitemap from "vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    Sitemap({
      hostname: "https://example.com",
      dynamicRoutes: ["/", "/booking", "/login", "/welcome"],
    }),
  ],
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
