import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion", "gsap"],
          charts: ["recharts", "@tanstack/react-table"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"]
        }
      }
    }
  },
  server: {
    port: 5174
  }
});
