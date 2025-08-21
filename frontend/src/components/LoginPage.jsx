// VERSÃO MELHORADA - LoginPage_improved.jsx
// MELHORIAS: Design responsivo otimizado para mobile, UX aprimorada, animações suaves

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, Smartphone, Shield, TrendingUp } from 'lucide-react';
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
    
    // Simular login para teste
    setTimeout(() => {
      setLoading(false);
      onLogin();
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E' )]" style={{ backgroundSize: '60px 60px' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          
          {/* Logo and Brand */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img 
                src={logoImage} 
                alt="InvestBet Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-blue-600 text-2xl font-bold">IB</div>';
                }}
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                INVESTBET
              </h1>
              <p className="text-blue-200 text-sm sm:text-base font-medium">
                Sua plataforma de investimentos profissionais
              </p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl sm:text-2xl text-gray-800">Entrar</CardTitle>
              <CardDescription className="text-gray-600">
                Digite suas credenciais para acessar sua conta
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r animate-pulse">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={credentials.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="email"
                      className="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </Label>
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
                      autoComplete="current-password"
                      className="w-full h-12 pl-4 pr-12 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      disabled={loading}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loading || !credentials.email || !credentials.password}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Entrando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn className="mr-2 h-5 w-5" />
                      Entrar
                    </div>
                  )}
                </Button>

                {/* Register Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <Link 
                      to="/register" 
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-200"
                    >
                      Criar conta
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium">Seguro</p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium">Rentável</p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium">Mobile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

/*
MELHORIAS IMPLEMENTADAS:

🎨 DESIGN:
- ✅ Background gradient mais moderno com padrão sutil
- ✅ Logo com efeito hover e animação
- ✅ Card com backdrop blur e transparência
- ✅ Botões com gradientes e efeitos hover
- ✅ Campos de input maiores e mais acessíveis

📱 RESPONSIVIDADE:
- ✅ Layout totalmente responsivo (mobile-first)
- ✅ Tamanhos adaptativos para diferentes telas
- ✅ Espaçamentos otimizados para touch
- ✅ Tipografia responsiva

🎭 ANIMAÇÕES:
- ✅ Transições suaves em todos os elementos
- ✅ Efeitos hover nos botões e links
- ✅ Loading spinner animado
- ✅ Animação de erro com pulse

🔧 UX/UI:
- ✅ Campos de input maiores (melhor para mobile)
- ✅ Feedback visual melhorado
- ✅ Ícones informativos
- ✅ Seção de features destacada
- ✅ Melhor hierarquia visual

♿ ACESSIBILIDADE:
- ✅ Contraste melhorado
- ✅ Tamanhos de toque adequados
- ✅ Labels e autocomplete mantidos
- ✅ Estados de foco visíveis
*/
