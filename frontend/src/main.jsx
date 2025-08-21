import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createClient } from '@supabase/supabase-js';

// 1. Lê as suas chaves do Supabase do arquivo .env
// Certifique-se de que estas variáveis estão definidas no seu arquivo .env na raiz do projeto:
// VITE_SUPABASE_URL="https://cvjeoxneffctybjspjcs.supabase.co"
// VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_PUBLIC_AQUI"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Corrigido para VITE_SUPABASE_ANON_KEY

// 2. Cria o cliente Supabase e o EXPORTA para que outros arquivos possam usá-lo
export const supabase = createClient(supabaseUrl, supabaseKey );

// 3. Renderiza o seu aplicativo
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
