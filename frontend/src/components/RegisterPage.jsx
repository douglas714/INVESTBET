// VERSÃO CORRIGIDA - RegisterPage.jsx
// CORREÇÃO: Adicionados atributos autocomplete para melhor UX e acessibilidade

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import logoImage from '../assets/investbet-logo.jpg';
import { supabase } from '../main';
import { useToast } from "@/components/ui/use-toast"

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    cpf: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Frontend agora envia os dados direto para o Supabase
      // Isso é mais simples e seguro.
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            // AQUI ESTÁ A CONEXÃO CRÍTICA:
            // Enviamos o nome do usuário na chave 'fullname', que o trigger espera.
            fullname: formData.username,
            phone: formData.phone,
            cpf: formData.cpf
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      toast({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.",
      });
      navigate('/login');
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Ocorreu um erro ao criar a conta.');
      toast({
        title: "Erro no Cadastro",
        description: err.message || "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
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
          <CardDescription>Preencha os dados para começar a investir</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Nome Completo</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Seu nome completo"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
                disabled={loading}
                autoComplete="name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                disabled={loading}
                autoComplete="tel"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
                required
                disabled={loading}
                autoComplete="off"
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
                  placeholder="Crie uma senha segura"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  minLength="6"
                  disabled={loading}
                  autoComplete="new-password"
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
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando conta...
                </div>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar Conta
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Fazer Login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
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

export default RegisterPage;
