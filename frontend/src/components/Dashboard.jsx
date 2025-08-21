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
