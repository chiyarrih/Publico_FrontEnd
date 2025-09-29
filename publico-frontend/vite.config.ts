import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@config": path.resolve(__dirname, "src/config"),
      "@citizen": path.resolve(__dirname, "src/features/citizen"),
      "@agency": path.resolve(__dirname, "src/features/agency"),
    },
  },
});
