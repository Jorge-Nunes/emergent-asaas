import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExecutionChart } from "@/components/ExecutionChart";
import { StatusChart } from "@/components/StatusChart";
import { Button } from "@/components/ui/button";
import { Download, FileText, MessageSquare, PlayCircle } from "lucide-react";

// TODO: Remove mock data
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

export default function Relatorios() {
  const handleExport = () => {
    console.log('Exportando relatório...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Relatórios</h1>
          <p className="text-muted-foreground mt-1">Análise detalhada das execuções e cobranças</p>
        </div>
        <Button onClick={handleExport} data-testid="button-export">
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="messages" data-testid="tab-messages">Mensagens</TabsTrigger>
          <TabsTrigger value="cobrancas" data-testid="tab-cobrancas">Cobranças</TabsTrigger>
          <TabsTrigger value="executions" data-testid="tab-executions">Execuções</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Cobranças</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">120</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Neste mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">342</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Últimos 30 dias
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Execuções</CardTitle>
                <PlayCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">30</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Neste mês
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExecutionChart data={mockChartData} />
            <StatusChart data={mockStatusData} />
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mensagens por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vence Hoje</span>
                    <span className="text-sm font-semibold tabular-nums">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aviso</span>
                    <span className="text-sm font-semibold tabular-nums">186</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taxa de Sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold tabular-nums text-chart-2">98.5%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  337 de 342 mensagens enviadas com sucesso
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cobrancas" className="space-y-6">
          <StatusChart data={mockStatusData} />
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          <ExecutionChart data={mockChartData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
