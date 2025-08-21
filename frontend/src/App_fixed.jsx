import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegisterPage_fixed from './components/RegisterPage_fixed'
import ContractPage from './components/ContractPage'
import Dashboard from './components/Dashboard'
import AdminPanel_fixed from './components/AdminPanel_fixed'
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
          // Para admin, usar dados do token
          if (data.user.id === 'admin') {
            setUser({
              id: 'admin',
              name: 'Administrador',
              email: data.user.email,
              balance: 50000.00,
              monthly_profit: 5.2,
              accumulated_profit: 15.8,
              is_admin: true
            })
          } else {
            // Para usuários normais, buscar dados completos do perfil
            try {
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
            } catch (userError) {
              console.error('Erro ao buscar dados do usuário:', userError)
              setUser(data.user)
            }
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

  const handleLogout = async () => {
    try {
      // Tentar fazer logout no backend
      const token = localStorage.getItem('investapp_token')
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      // Limpar estado local independentemente do resultado
      setUser(null)
      setContractAccepted(false)
      localStorage.removeItem('investapp_token')
      localStorage.removeItem('investapp_contract')
    }
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
                <RegisterPage_fixed onRegister={handleRegister} />
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
                <Navigate to={user ? "/dashboard" : "/login"} replace />
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
                <AdminPanel_fixed />
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

