// CÓDIGO CORRIGIDO PARA: src/hooks/useFinancialData.js

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../main';

export const useFinancialData = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinancialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Pega o usuário logado da sessão do Supabase para saber o ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      // 2. ESTA É A PARTE CRÍTICA: Pega o token da NOSSA API do localStorage
      const token = localStorage.getItem('app_token');
      if (!token) {
        throw new Error("Token da aplicação não encontrado. Faça o login novamente.");
      }

      // 3. Faz a chamada para a API enviando o token correto
      const response = await fetch(`/api/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // USA O TOKEN CORRETO
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro do servidor: ${response.status}`);
      }

      const data = await response.json();
      setFinancialData(data);

    } catch (err) {
      console.error("Erro em useFinancialData:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  return { financialData, loading, error, refreshData: fetchFinancialData };
};
