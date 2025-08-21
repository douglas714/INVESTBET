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
          </div>
        </div>
      </div>
    </div>
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
