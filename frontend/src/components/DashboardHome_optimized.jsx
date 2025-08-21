import React from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  LineChart,
  TrendingUp,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Componente otimizado da página inicial do dashboard
 * Utiliza o hook customizado useFinancialData para gerenciar estado
 */
export const DashboardHome = () => {
  const { 
    financialData, 
    loading, 
    error, 
    refreshData,
    debugInfo,
    clearDebugInfo
  } = useFinancialData();

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return value?.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) || '0,00';
  };

  // Função para calcular a porcentagem de crescimento (exemplo)
  const calculateGrowthPercentage = () => {
    if (financialData.balance > 0 && financialData.monthly_profit > 0) {
      return ((financialData.monthly_profit / financialData.balance) * 100).toFixed(2);
    }
    return '0.00';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-lg">Carregando dados financeiros...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600">Erro: {error}</div>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard Financeiro</h1>
        <div className="flex space-x-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          {debugInfo.length > 0 && (
            <Button onClick={clearDebugInfo} variant="outline" size="sm">
              Limpar Debug
            </Button>
          )}
        </div>
      </div>
      
      {/* Cards de métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Saldo Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {formatCurrency(financialData.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo disponível para investimentos
            </p>
          </CardContent>
        </Card>

        {/* Lucro Mensal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {formatCurrency(financialData.monthly_profit)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{calculateGrowthPercentage()}% em relação ao saldo
            </p>
          </CardContent>
        </Card>

        {/* Lucro Acumulado */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Acumulado</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {formatCurrency(financialData.accumulated_profit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lucro total desde o início
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Card de resumo detalhado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Resumo da Conta</span>
          </CardTitle>
          <CardDescription>
            Visão geral dos seus investimentos e rendimentos atualizados em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Saldo Atual:</span>
              <span className="text-sm font-bold">R$ {formatCurrency(financialData.balance)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Rendimento Mensal:</span>
              <span className="text-sm font-bold text-green-600">
                R$ {formatCurrency(financialData.monthly_profit)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Total Acumulado:</span>
              <span className="text-sm font-bold text-blue-600">
                R$ {formatCurrency(financialData.accumulated_profit)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info (apenas em desenvolvimento) */}
      {debugInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono bg-gray-100 p-3 rounded max-h-40 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index}>{info}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground space-y-2">
            <p>• Os dados são atualizados automaticamente quando modificados no sistema.</p>
            <p>• O saldo total representa o valor disponível para novos investimentos.</p>
            <p>• O lucro mensal é calculado com base no período atual.</p>
            <p>• O lucro acumulado inclui todos os rendimentos desde o início da conta.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;

