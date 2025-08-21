// CÓDIGO CORRIGIDO E ATUALIZADO PARA: src/App.jsx
// Este arquivo integra as versões melhoradas do Login, Registro e Dashboard.

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './main'; // Certifique-se de que `supabase` está configurado corretamente em main.jsx

// Importe suas páginas. Use as versões '_improved' ou '_simplified' que foram fornecidas.
// Renomeie-as para os nomes originais ou ajuste os caminhos conforme sua preferência.
import Dashboard from './components/Dashboard_simplified'; // Usando a versão simplificada do Dashboard
import RegisterPage from './components/RegisterPage_improved'; // Usando a versão melhorada do Registro
import LoginPage from './components/LoginPage_improved'; // Usando a versão melhorada do Login
import ContractPage from './components/ContractPage'; // Mantenha se você ainda usa esta página
import AdminPanel from './components/AdminPanel_fixed'; // Mantenha se você ainda usa esta página

// Componente "cérebro" que gerencia as rotas
function AppRoutes() {
  const [session, setSession] = useState(null);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função que verifica a sessão e o contrato ao carregar o site
    const initializeUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      const storedContract = localStorage.getItem('investapp_contract');
      setContractAccepted(!!storedContract); // Converte para true ou false
      
      setLoading(false);
    };

    initializeUserSession();

    // Listener que reage em tempo real a logins e logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Se o usuário deslogar, reseta o estado do contrato
      if (!session) {
        localStorage.removeItem('investapp_contract');
        setContractAccepted(false);
      }
    });

    // Limpa o listener ao fechar o app
    return () => subscription.unsubscribe();
  }, []);

  // Função para ser chamada pela página de Contrato quando o usuário aceitar os termos
  const handleAcceptContract = () => {
    localStorage.setItem('investapp_contract', 'true');
    setContractAccepted(true);
  };
  
  // Mostra uma tela de carregamento enquanto a sessão é verificada
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // Lógica de Roteamento Inteligente
  return (
    <Routes>
      {/* --- ROTAS PARA USUÁRIOS DESLOGADOS --- */}
      {!session && (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Adicionada a rota de registro */}
          {/* Qualquer outra tentativa de acesso redireciona para o login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {/* --- ROTAS PARA USUÁRIOS LOGADOS --- */}
      {session && (
        <>
          {/* Se logado, mas NÃO aceitou o contrato */}
          {!contractAccepted && (
            <>
              <Route path="/contract" element={<ContractPage onAccept={handleAcceptContract} />} />
              {/* Qualquer outra tentativa de acesso redireciona para o contrato */}
              <Route path="*" element={<Navigate to="/contract" replace />} />
            </>
          )}

          {/* Se logado E JÁ aceitou o contrato */}
          {contractAccepted && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminPanel />} /> {/* Mantenha se for usar o painel admin */}
              {/* Se tentar acessar login/contrato/registro, redireciona para o dashboard */}
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              <Route path="/contract" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </>
      )}
    </Routes>
  );
}

// Componente principal que inicializa o Router
export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
