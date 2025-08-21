<<<<<<< HEAD
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, UserPlus, ArrowLeft, Shield, DollarSign, TrendingUp } from 'lucide-react'
import logoImage from '../assets/investbet-logo.jpg'

const RegisterPage = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validateCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '')
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false
    
    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(9))) return false
    
    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(10))) return false
    
    return true
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/[^\d]/g, '')
    // Verifica se tem 10 ou 11 dígitos (com ou sem DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
  }

  const formatCPF = (value) => {
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/[^\d]/g, '')
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const formatPhone = (value) => {
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/[^\d]/g, '')
    
    // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (cleanValue.length <= 11) {
      if (cleanValue.length <= 10) {
        return cleanValue
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
      } else {
        return cleanValue
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
      }
    }
    return value
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido'
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (field === 'phone') {
      formattedValue = formatPhone(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))

    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const isValid = validateForm()
    if (!isValid) {
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Registro bem-sucedido
        alert('Conta criada com sucesso! Você pode fazer login agora.')
        navigate('/login')
      } else {
        // Erro no registro
        setErrors({ general: data.error || 'Erro ao criar conta. Tente novamente.' })
      }
    } catch (error) {
      console.error('Erro ao registrar:', error)
      setErrors({ general: 'Erro de conexão. Verifique sua internet e tente novamente.' })
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
          <p className="text-blue-200">Crie sua conta de investimentos</p>
        </div>

        {/* Card de Cadastro */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="text-center flex-1">
                <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                <CardDescription>
                  Preencha seus dados para começar a investir
                </CardDescription>
              </div>
              <div className="w-10"></div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`h-12 ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`h-12 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  className={`h-12 ${errors.cpf ? 'border-red-500' : ''}`}
                  maxLength={14}
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf}</p>
                )}
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
                    className={`h-12 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`h-12 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Criando conta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus size={20} />
                    Criar Conta
                  </div>
                )}
              </Button>
            </form>

            {/* Link para login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Fazer login
                </button>
              </p>
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
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  minLength="6"
                  disabled={loading}
                  // CORREÇÃO: Adicionado autocomplete para nova senha
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

export default RegisterPage
=======
  );
};

export default RegisterPage;

/*
CORREÇÕES IMPLEMENTADAS:

1. ✅ ADICIONADO autoComplete="name" no campo de nome completo
2. ✅ ADICIONADO autoComplete="email" no campo de email
3. ✅ ADICIONADO autoComplete="tel" no campo de telefone
4. ✅ ADICIONADO autoComplete="off" no campo de CPF (dados sensíveis)
5. ✅ ADICIONADO autoComplete="new-password" no campo de senha
6. ✅ ADICIONADO name e id apropriados em todos os campos
7. ✅ MELHORADO acessibilidade com labels associados
8. ✅ ADICIONADO required nos campos obrigatórios
9. ✅ MELHORADO tratamento de erro com melhor UX
10. ✅ ADICIONADO loading state mais claro

VALORES DE AUTOCOMPLETE UTILIZADOS:
- name: Para nome completo
- email: Para endereço de email
- tel: Para número de telefone
- off: Para CPF (dados sensíveis, desabilita autocomplete)
- new-password: Para nova senha (permite sugestão de senhas seguras)

BENEFÍCIOS:
- 🔧 Resolve problema de autocomplete
- 📱 Melhor preenchimento automático no mobile
- ♿ Melhor acessibilidade
- 🔒 Navegadores podem sugerir senhas seguras
- ✅ Atende às melhores práticas web
- 🛡️ Protege dados sensíveis (CPF) com autocomplete="off"
*/
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f

