import { useState, useEffect } from 'react';
import { supabase } from '../main';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (loading) return <div className="p-8">Carregando perfil...</div>;
  if (!user) return <div className="p-8">Usuário não encontrado.</div>;

  const profileData = {
    username: user.user_metadata?.fullname || 'N/A',
    fullName: user.user_metadata?.fullname || 'N/A',
    email: user.email,
    phone: user.user_metadata?.phone || 'N/A',
    cpf: user.user_metadata?.cpf || 'N/A',
    status: 'Ativo'
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Button>
        <Card>
          <CardHeader><CardTitle>Informações do Perfil</CardTitle><CardDescription>Seus dados pessoais e de contato.</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 items-center gap-2"><Label>Nome de Usuário</Label><Input className="md:col-span-2" value={profileData.username} readOnly disabled /></div>
              <div className="grid md:grid-cols-3 items-center gap-2"><Label>Nome Completo</Label><Input className="md:col-span-2" value={profileData.fullName} readOnly disabled /></div>
              <div className="grid md:grid-cols-3 items-center gap-2"><Label>E-mail</Label><Input className="md:col-span-2" type="email" value={profileData.email} readOnly disabled /></div>
              <div className="grid md:grid-cols-3 items-center gap-2"><Label>Telefone</Label><Input className="md:col-span-2" value={profileData.phone} readOnly disabled /></div>
              <div className="grid md:grid-cols-3 items-center gap-2"><Label>CPF</Label><Input className="md:col-span-2" value={profileData.cpf} readOnly disabled /></div>
              <div className="grid md:grid-cols-3 items-center gap-2"><Label>Status</Label><Input className="md:col-span-2 text-green-600 font-semibold" value={profileData.status} readOnly disabled /></div>
            </div>
            <div className="mt-8 border-t pt-6 flex justify-end"><Button disabled>Editar Perfil</Button></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ProfilePage;
