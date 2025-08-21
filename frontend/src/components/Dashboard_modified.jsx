import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '../main';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Home,
  LineChart,
  Package2,
  Settings,
  Users,
  Briefcase,
  UserCircle,
  LogOut
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  // Componente para os links do menu, para evitar repetição de código
  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* MENU LATERAL (SIDEBAR) */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">InvestBet Capital</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink to="/dashboard" icon={Home}>Início</NavLink>
              <NavLink to="/dashboard/investments" icon={Briefcase}>Meus Investimentos</NavLink>
              <NavLink to="/dashboard/analytics" icon={LineChart}>Análises</NavLink>
              <NavLink to="/dashboard/profile" icon={UserCircle}>Perfil</NavLink>
              {/* Adicionar link para Admin se o usuário for admin */}
            </nav>
          </div>
          <div className="mt-auto p-4">
             <Button size="sm" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* AQUI PODE ADICIONAR UM MENU PARA TELAS PEQUENAS NO FUTURO */}
          <div className="w-full flex-1">
            {/* PODE ADICIONAR UMA BARRA DE BUSCA AQUI */}
          </div>
          <p className="text-sm text-gray-600">{user.email}</p>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* O Outlet renderiza as páginas filhas (Início, Investimentos, etc.) */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

// Componentes de exemplo para as sub-páginas
export const DashboardHome = () => {
  const [financialData, setFinancialData] = useState({
    balance: 0,
    monthly_profit: 0,
    accumulated_profit: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Usuário não autenticado');
          return;
        }

        // Buscar dados financeiros do usuário
        const { data, error } = await supabase
          .from('user_finances')
          .select('balance, monthly_profit, accumulated_profit')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar dados financeiros:', error);
          setError('Erro ao carregar dados financeiros');
        } else {
          setFinancialData(data || {
            balance: 0,
            monthly_profit: 0,
            accumulated_profit: 0
          });
        }
      } catch (err) {
        console.error('Erro:', err);
        setError('Erro inesperado');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();

    // Configurar subscription para atualizações em tempo real
    const subscription = supabase
      .channel('user_finances_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_finances' 
        }, 
        (payload) => {
          console.log('Mudança detectada:', payload);
          // Atualizar dados quando houver mudanças
          fetchFinancialData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados financeiros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard Financeiro</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {financialData.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo disponível para investimentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Mensal</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {financialData.monthly_profit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Lucro obtido neste mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Acumulado</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {financialData.accumulated_profit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Lucro total acumulado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo da Conta</CardTitle>
          <CardDescription>
            Visão geral dos seus investimentos e rendimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Saldo Atual:</span>
              <span className="text-sm">R$ {financialData.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Rendimento Mensal:</span>
              <span className="text-sm text-green-600">R$ {financialData.monthly_profit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Acumulado:</span>
              <span className="text-sm text-green-600">R$ {financialData.accumulated_profit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const InvestmentsPage = () => (
  <div className="flex items-center">
    <h1 className="text-lg font-semibold md:text-2xl">Meus Investimentos</h1>
  </div>
);

export const AnalyticsPage = () => (
  <div className="flex items-center">
    <h1 className="text-lg font-semibold md:text-2xl">Análises</h1>
  </div>
);

export const ProfilePage = () => (
  <div className="flex items-center">
    <h1 className="text-lg font-semibold md:text-2xl">Meu Perfil</h1>
  </div>
);

export default Dashboard;

