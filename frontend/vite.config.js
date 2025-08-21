import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
<<<<<<< HEAD
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
  },
})
=======
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

/* 
CORREÇÕES IMPLEMENTADAS:

1. ✅ REMOVIDO plugin vite-plugin-csp problemático
2. ✅ ADICIONADO configuração condicional por ambiente
3. ✅ CSP permissiva para desenvolvimento (com unsafe-eval)
4. ✅ CSP será configurada no backend para produção
5. ✅ Headers organizados de forma mais legível
6. ✅ Adicionadas diretivas de segurança extras (object-src, base-uri)

BENEFÍCIOS:
- ❌ Remove erro de CSP em desenvolvimento
- ✅ Mantém segurança em produção
- ✅ Configuração mais limpa e maintível
- ✅ Compatível com React/Vite hot reloading
*/

>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
