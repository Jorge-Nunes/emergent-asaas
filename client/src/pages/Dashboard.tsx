import { MetricCard } from "@/components/MetricCard";
import { ExecutionChart } from "@/components/ExecutionChart";
import { StatusChart } from "@/components/StatusChart";
import { ExecutionLogTable } from "@/components/ExecutionLogTable";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, MessageSquare, TrendingUp, Play, RefreshCw } from "lucide-react";
import { useState } from "react";

// TODO: Remove mock data
const mockMetrics = {
  totalPendente: 12450.00,
  venceHoje: 8,
  mensagensEnviadas: 142,
  taxaConversao: 78.5,
};

const mockChartData = [
  { date: '01/01', mensagens: 45, erros: 2 },
  { date: '02/01', mensagens: 52, erros: 1 },
  { date: '03/01', mensagens: 38, erros: 3 },
  { date: '04/01', mensagens: 61, erros: 0 },
  { date: '05/01', mensagens: 48, erros: 2 },
  { date: '06/01', mensagens: 55, erros: 1 },
  { date: '07/01', mensagens: 43, erros: 0 },
];

const mockStatusData = [
  { name: 'Pendente', value: 45 },
  { name: 'Recebido', value: 28 },
  { name: 'Vencido', value: 12 },
  { name: 'Confirmado', value: 35 },
];

const mockLogs = [
  {
    id: '1',
    cobrancaId: 'cob_1',
    customerName: 'João Silva',
    customerPhone: '11999999999',
    tipo: 'vence_hoje' as const,
    status: 'success' as const,
    mensagem: 'Mensagem enviada com sucesso',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    cobrancaId: 'cob_2',
    customerName: 'Maria Santos',
    customerPhone: '11988888888',
    tipo: 'aviso' as const,
    status: 'success' as const,
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

export default function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);

  const handleRunExecution = () => {
    setIsRunning(true);
    console.log('Executando processamento...');
    setTimeout(() => {
      setIsRunning(false);
      console.log('Processamento concluído');
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do sistema de cobranças</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button 
            onClick={handleRunExecution} 
            disabled={isRunning}
            data-testid="button-run-execution"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Executando...' : 'Executar Agora'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pendente"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mockMetrics.totalPendente)}
          icon={DollarSign}
          trend={{ value: 5.2, isPositive: false }}
        />
        <MetricCard
          title="Vence Hoje"
          value={mockMetrics.venceHoje}
          icon={FileText}
          trend={{ value: 12.3, isPositive: true }}
        />
        <MetricCard
          title="Mensagens Enviadas"
          value={mockMetrics.mensagensEnviadas}
          icon={MessageSquare}
          trend={{ value: 8.7, isPositive: true }}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${mockMetrics.taxaConversao}%`}
          icon={TrendingUp}
          trend={{ value: 3.1, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExecutionChart data={mockChartData} />
        <StatusChart data={mockStatusData} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Últimas Execuções</h2>
        <ExecutionLogTable logs={mockLogs} />
      </div>
    </div>
  );
}
