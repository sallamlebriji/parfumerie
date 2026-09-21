import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Seul le socle React est isolé : les bibliothèques réservées à l'admin (graphiques, animations)
        // suivent naturellement les pages chargées à la demande et ne pèsent plus sur la boutique.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"]
        }
      }
    }
  },
  server: {
    port: 5174
  }
});
