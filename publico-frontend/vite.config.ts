import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@config": "/src/config",
      "@citizen": "/src/features/citizen",
      "@agency": "/src/features/agency",
      "@admin": "/src/features/admin",
      "@shared": "/src/shared",
      "@utils": "/src/utils",
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/api/price': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/price/, '/api/v3/simple/price'),
      },
    }
  }
});
