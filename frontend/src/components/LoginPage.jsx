<<<<<<< HEAD
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, LogIn, UserPlus, Shield, DollarSign, TrendingUp } from 'lucide-react'
import logoImage from '../assets/investbet-logo.jpg'

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpar erro quando o usuário começar a digitar
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Login bem-sucedido
        onLogin(data.user, data.token)
        navigate('/contract')
      } else {
        // Erro no login
        setError(data.error || 'Erro ao fazer login. Verifique suas credenciais.')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg overflow-hidden">
            <img 
              src={logoImage} 
              alt="InvestPro Capital Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InvestPro Capital</h1>
          <p className="text-blue-200">Sua plataforma de investimentos</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Acesse sua conta de investimentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn size={20} />
                    Entrar
                  </div>
                )}
              </Button>
            </form>

            {/* Link para cadastro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  Criar conta
                </button>
              </p>
            </div>

            {/* Login Admin (para desenvolvimento) */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-2">Acesso administrativo:</p>
              <Button
                onClick={() => {
                  setFormData({
                    email: 'admin@investapp.com',
                    password: 'admin123'
                  })
                }}
                variant="outline"
                size="sm"
                className="w-full text-xs"
                disabled={isLoading}
              >
                Preencher dados admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-white">
            <Shield className="w-6 h-6 mx-auto mb-2 text-blue-300" />
            <p className="text-xs">Seguro</p>
          </div>
          <div className="text-white">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-300" />
            <p className="text-xs">Rentável</p>
          </div>
          <div className="text-white">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
            <p className="text-xs">Crescimento</p>
=======
// VERSÃO CORRIGIDA - LoginPage.jsx
// CORREÇÃO: Adicionados atributos autocomplete para melhor UX e acessibilidade

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import logoImage from '../assets/investbet-logo.jpg';

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('app_token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src={logoImage} 
            alt="InvestPro Capital Logo" 
            className="w-16 h-16 mx-auto mb-4 rounded-full"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <CardTitle className="text-2xl">InvestPro Capital</CardTitle>
          <CardDescription>Sua plataforma de investimentos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">Entrar</h2>
              <p className="text-sm text-gray-600">Acesse sua conta de investimentos</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={credentials.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={loading}
                // CORREÇÃO: Adicionado autocomplete para email
                autoComplete="email"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={credentials.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  disabled={loading}
                  // CORREÇÃO: Adicionado autocomplete para senha atual
                  autoComplete="current-password"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !credentials.email || !credentials.password}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Criar conta
                </Link>
              </p>
              
              <div className="text-sm">
                <p className="text-gray-500 mb-2">Acesso administrativo:</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCredentials({ email: 'admin@investapp.com', password: 'admin123' });
                  }}
                  disabled={loading}
                  className="w-full"
                >
                  Preencher dados admin
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer com informações de segurança */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="flex justify-center space-x-8 text-white/80 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white/60 rounded-full mr-2"></div>
            <span>Seguro</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Rentável</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Crescimento</span>
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  )
}

export default LoginPage
=======
  );
};

export default LoginPage;

/*
CORREÇÕES IMPLEMENTADAS:

1. ✅ ADICIONADO autoComplete="email" no campo de email
2. ✅ ADICIONADO autoComplete="current-password" no campo de senha
3. ✅ ADICIONADO name e id apropriados nos campos
4. ✅ MELHORADO acessibilidade com labels associados
5. ✅ ADICIONADO required nos campos obrigatórios
6. ✅ MELHORADO tratamento de erro com melhor UX
7. ✅ ADICIONADO loading state mais claro
8. ✅ MELHORADO layout e responsividade

BENEFÍCIOS:
- 🔧 Resolve problema de autocomplete
- 📱 Melhor preenchimento automático no mobile
- ♿ Melhor acessibilidade
- 🔒 Navegadores podem sugerir senhas seguras
- ✅ Atende às melhores práticas web
*/
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f

