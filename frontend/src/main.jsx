import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createClient } from '@supabase/supabase-js';

// 1. Lê as suas chaves do Supabase do arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// 2. Cria o cliente Supabase e o EXPORTA para que outros arquivos possam usá-lo
export const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Renderiza o seu aplicativo
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
