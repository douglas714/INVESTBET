import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: '../src/static',
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
      // CSP configurada via headers do servidor de desenvolvimento
      headers: isDev ? {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval para desenvolvimento
          "style-src 'self' 'unsafe-inline'", // unsafe-inline para Tailwind
          "connect-src 'self' https://*.supabase.co https://*.onrender.com",
          "img-src 'self' data: https:",
          "font-src 'self' https:",
          "object-src 'none'",
          "base-uri 'self'"
        ].join('; ')
      } : {}
    },
  };
});
