<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ContractPage from './components/ContractPage'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [contractAccepted, setContractAccepted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo e validar com o backend
    const token = localStorage.getItem('investapp_token')
    if (token) {
      validateToken(token)
    } else {
      setLoading(false)
    }

    // Verificar se o contrato foi aceito
    const savedContract = localStorage.getItem('investapp_contract')
    if (savedContract) {
      setContractAccepted(JSON.parse(savedContract))
    }
  }, [])

  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Buscar dados completos do usuário
          const userResponse = await fetch(`/api/users/${data.user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUser(userData)
          } else {
            // Se não conseguir buscar dados do usuário, usar dados básicos do token
            setUser(data.user)
          }
        } else {
          localStorage.removeItem('investapp_token')
        }
      } else {
        localStorage.removeItem('investapp_token')
      }
    } catch (error) {
      console.error('Erro ao validar token:', error)
      localStorage.removeItem('investapp_token')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData, token) => {
    setUser(userData)
    localStorage.setItem('investapp_token', token)
  }

  const handleRegister = () => {
    // Após registro bem-sucedido, redirecionar para login
    // O registro não faz login automático por segurança
  }

  const handleContractAccept = () => {
    setContractAccepted(true)
    localStorage.setItem('investapp_contract', JSON.stringify(true))
  }

  const handleLogout = () => {
    setUser(null)
    setContractAccepted(false)
    localStorage.removeItem('investapp_token')
    localStorage.removeItem('investapp_contract')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              !user ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to={contractAccepted ? "/dashboard" : "/contract"} replace />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !user ? (
                <RegisterPage onRegister={handleRegister} />
              ) : (
                <Navigate to={contractAccepted ? "/dashboard" : "/contract"} replace />
              )
            } 
          />
          <Route 
            path="/contract" 
            element={
              user && !contractAccepted ? (
                <ContractPage onAccept={handleContractAccept} />
              ) : (
                <Navigate to={user ? "/dashboard" : "/contract"} replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user && contractAccepted ? (
                <Dashboard 
                  user={user} 
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/admin" 
            element={
              user && user.is_admin ? (
                <AdminPanel />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
=======
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
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
