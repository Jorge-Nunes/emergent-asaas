import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecutionLogTable } from "@/components/ExecutionLogTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Execution, ExecutionLog } from "@shared/schema";

// TODO: Remove mock data
const mockExecutions: Execution[] = [
  {
    id: 'exec_1',
    timestamp: new Date().toISOString(),
    status: 'completed',
    cobrancasProcessadas: 45,
    mensagensEnviadas: 43,
    erros: 2,
    detalhes: [],
  },
  {
    id: 'exec_2',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    cobrancasProcessadas: 52,
    mensagensEnviadas: 51,
    erros: 1,
    detalhes: [],
  },
];

const mockLogs: ExecutionLog[] = [
  {
    id: '1',
    cobrancaId: 'cob_1',
    customerName: 'João Silva',
    customerPhone: '11999999999',
    tipo: 'vence_hoje',
    status: 'success',
    mensagem: 'Mensagem enviada com sucesso',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    cobrancaId: 'cob_2',
    customerName: 'Maria Santos',
    customerPhone: '11988888888',
    tipo: 'aviso',
    status: 'success',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '3',
    cobrancaId: 'cob_3',
    customerName: 'Pedro Costa',
    customerPhone: '11977777777',
    tipo: 'vence_hoje',
    status: 'error',
    erro: 'Número inválido',
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
];

export default function Execucoes() {
  const [selectedExecution, setSelectedExecution] = useState<string | null>(mockExecutions[0]?.id || null);

  const getStatusIcon = (status: Execution['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-chart-2" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'running':
        return <Clock className="h-4 w-4 text-chart-4" />;
    }
  };

  const getStatusBadge = (status: Execution['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-chart-2">Concluída</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'running':
        return <Badge variant="secondary">Em execução</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Execuções</h1>
          <p className="text-muted-foreground mt-1">Histórico de todas as execuções automáticas</p>
        </div>
        <Button data-testid="button-run-now">
          <Play className="h-4 w-4 mr-2" />
          Executar Agora
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">Histórico</h2>
          {mockExecutions.map((execution) => (
            <Card
              key={execution.id}
              className={`cursor-pointer transition-colors ${
                selectedExecution === execution.id ? 'ring-2 ring-primary' : ''
              } hover-elevate`}
              onClick={() => setSelectedExecution(execution.id)}
              data-testid={`card-execution-${execution.id}`}
            >
              <CardHeader className="space-y-0 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(execution.status)}
                    <CardTitle className="text-sm">
                      {format(new Date(execution.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </CardTitle>
                  </div>
                  {getStatusBadge(execution.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Processadas</p>
                    <p className="font-semibold tabular-nums">{execution.cobrancasProcessadas}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enviadas</p>
                    <p className="font-semibold tabular-nums text-chart-2">{execution.mensagensEnviadas}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Erros</p>
                    <p className="font-semibold tabular-nums text-destructive">{execution.erros}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Detalhes da Execução</h2>
          {selectedExecution ? (
            <ExecutionLogTable logs={mockLogs} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Selecione uma execução para ver os detalhes
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
