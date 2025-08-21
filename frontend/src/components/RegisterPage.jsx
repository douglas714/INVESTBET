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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // Manteremos 'username' para o estado do formulário
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

      alert('Cadastro realizado com sucesso! Por favor, verifique seu e-mail para confirmar a conta e depois faça login.');
      navigate('/login');
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Ocorreu um erro ao criar a conta.');
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
                // CORREÇÃO: Adicionado autocomplete para nome completo
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
                // CORREÇÃO: Adicionado autocomplete para email
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
                // CORREÇÃO: Adicionado autocomplete para telefone
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
                // CORREÇÃO: Adicionado autocomplete para CPF (usando off para dados sensíveis)
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
