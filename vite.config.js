import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", // FORCE IPv4
    port: 3000,       // different port
    strictPort: true,
  },
});
