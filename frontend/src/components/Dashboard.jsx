<<<<<<< HEAD
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  Settings, 
  TrendingUp, 
  DollarSign,
  PieChart,
  BarChart3,
  User,
  Shield
} from 'lucide-react'
import logoImage from '../assets/investbet-logo.jpg'

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full shadow-md overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="InvestPro Capital" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">InvestPro Capital</h1>
                <p className="text-sm text-gray-500">Dashboard do Investidor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.username || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              {user?.is_admin && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(user?.balance)}</div>
              <p className="text-xs text-muted-foreground">
                Valor disponível para investimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(user?.monthly_profit)}
              </div>
              <p className="text-xs text-muted-foreground">
                Rendimento do mês atual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Acumulado</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(user?.accumulated_profit)}
              </div>
              <p className="text-xs text-muted-foreground">
                Rendimento total acumulado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </Button>
          <Button
            variant={activeTab === 'investments' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('investments')}
          >
            Investimentos
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('profile')}
          >
            Perfil
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Conta</CardTitle>
                <CardDescription>
                  Informações principais do seu investimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status da Conta:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Ativa
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tipo de Investidor:</span>
                  <span className="text-sm font-medium">Conservador</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data de Cadastro:</span>
                  <span className="text-sm font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
                <CardDescription>
                  Recomendações para otimizar seus investimentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Diversifique sua carteira</p>
                    <p className="text-xs text-gray-600">Considere diferentes tipos de investimento</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Aumente seus aportes</p>
                    <p className="text-xs text-gray-600">Invista regularmente para melhores resultados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'investments' && (
          <Card>
            <CardHeader>
              <CardTitle>Meus Investimentos</CardTitle>
              <CardDescription>
                Acompanhe o desempenho dos seus investimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum investimento ativo
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece a investir para ver seus investimentos aqui
                </p>
                <Button>
                  Fazer Primeiro Investimento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Seus dados pessoais e de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome de Usuário</label>
                  <p className="text-sm text-gray-900 mt-1">{user?.username || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                  <p className="text-sm text-gray-900 mt-1">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">E-mail</label>
                  <p className="text-sm text-gray-900 mt-1">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-sm text-gray-900 mt-1">{user?.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CPF</label>
                  <p className="text-sm text-gray-900 mt-1">{user?.cpf || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900 mt-1">{user?.status || 'Ativo'}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Editar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Access */}
        {user?.is_admin && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Shield className="w-5 h-5" />
                Acesso Administrativo
              </CardTitle>
              <CardDescription>
                Você tem privilégios de administrador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.open('/admin', '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Abrir Painel Administrativo
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default Dashboard

=======
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../main';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, DollarSign, BarChart, Shield } from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';
import logoImage from '../assets/investbet-logo.jpg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { financialData, loading: loadingFinancial, error: financialError } = useFinancialData();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getUserDisplayName = () => {
    if (!user) return '...';
    return user.user_metadata?.fullname || user.user_metadata?.full_name || 'Usuário';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (!name || name === 'Usuário' || name === '...') return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  if (loadingUser || loadingFinancial) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col fixed h-full">
        <div className="p-4 flex items-center space-x-3 border-b border-gray-700">
          <img src={logoImage} alt="Logo" className="h-10 w-10 rounded-full" />
          <h1 className="text-xl font-bold">InvestBet</h1>
        </div>
        <div className="p-4 flex flex-col items-center text-center border-b border-gray-700">
          <Avatar className="h-20 w-20 mb-3"><AvatarImage src={user?.user_metadata?.avatar_url} /><AvatarFallback className="text-2xl bg-gray-600">{getUserInitials()}</AvatarFallback></Avatar>
          <h2 className="font-semibold text-lg">{getUserDisplayName()}</h2>
          <p className="text-xs text-gray-400 break-all">{user?.email}</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-white bg-gray-900"><BarChart className="mr-3 h-5 w-5" />Dashboard</Button>
          <Button variant="ghost" onClick={() => navigate('/profile')} className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"><User className="mr-3 h-5 w-5" />Minha Conta</Button>
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"><DollarSign className="mr-3 h-5 w-5" />Depósitos</Button>
          {user?.user_metadata?.is_admin && (<Button variant="ghost" onClick={() => navigate('/admin')} className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"><Shield className="mr-3 h-5 w-5" />Painel Admin</Button>)}
        </nav>
        <div className="p-2 border-t border-gray-700"><Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"><LogOut className="mr-3 h-5 w-5" />Sair</Button></div>
      </aside>
      <main className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Desempenho</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-blue-500 text-white"><CardHeader><CardTitle>Saldo Total</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{formatCurrency(financialData.balance)}</p></CardContent></Card>
          <Card className="bg-green-500 text-white"><CardHeader><CardTitle>Lucro Mensal</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{financialData.monthly_profit?.toFixed(2) || '0.00'}%</p></CardContent></Card>
          <Card className="bg-purple-500 text-white"><CardHeader><CardTitle>Lucro Acumulado</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{financialData.accumulated_profit?.toFixed(2) || '0.00'}%</p></CardContent></Card>
        </div>
        {financialError && <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-md">Erro: {financialError}</div>}
      </main>
    </div>
  );
};
export default Dashboard;
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
