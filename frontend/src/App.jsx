// CÓDIGO FINAL E COMPLETO PARA: src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './main';

// Importe suas páginas. Verifique se os caminhos estão corretos para seu projeto.
import Dashboard from './components/Dashboard';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage'; 
import ContractPage from './components/ContractPage'; 
import AdminPanel from './components/AdminPanel_fixed'; 

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
          <Route path="/register" element={<RegisterPage />} />
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
              <Route path="/admin" element={<AdminPanel />} />
              {/* Se tentar acessar login/contrato, redireciona para o dashboard */}
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
