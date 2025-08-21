import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../main';

const ProtectedRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    // Pode adicionar um spinner de carregamento aqui se quiser
    return <div>Carregando...</div>;
  }

  if (!session) {
    // Se não houver sessão, redireciona para o login
    return <Navigate to="/login" replace />;
  }

  // Se houver sessão, renderiza a página solicitada (Contrato, Dashboard, etc.)
  return <Outlet />;
};

export default ProtectedRoute;