import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/realtime-earthquake-monitor/",
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  build: {
    minify: false,
  },
});
