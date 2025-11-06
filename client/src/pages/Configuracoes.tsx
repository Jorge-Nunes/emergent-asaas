import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TODO: Remove mock data
const mockConfig = {
  asaasToken: 'aact_prod_••••••••',
  asaasUrl: 'https://api.asaas.com/v3',
  evolutionUrl: 'http://evo.evo.dedyn.io:6001',
  evolutionInstance: 'teksat',
  evolutionApiKey: 'm5f7sy11••••••••',
  diasAviso: 10,
  messageTemplates: {
    venceHoje: 'Olá, aqui é da *TEKSAT Rastreamento Veicular*!\nNotamos que sua fatura vence *hoje* 📅.\n\n🔗 Link da fatura: {{link_fatura}}\n💰 Valor: {{valor}}\n📆 Vencimento: {{vencimento}}',
    aviso: 'Olá, tudo bem? Somos da *TEKSAT Rastreamento Veicular*.\nFaltam apenas {{dias_aviso}} dia(s) para o vencimento da sua fatura 🗓️.\n\n🔗 Link da fatura: {{link_fatura}}\n💰 Valor: {{valor}}\n🗓️ Vencimento: {{vencimento}}',
  },
};

export default function Configuracoes() {
  const { toast } = useToast();
  const [config, setConfig] = useState(mockConfig);

  const handleSave = () => {
    console.log('Salvando configurações:', config);
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue="asaas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="asaas" data-testid="tab-asaas">Asaas</TabsTrigger>
          <TabsTrigger value="evolution" data-testid="tab-evolution">Evolution API</TabsTrigger>
          <TabsTrigger value="preferences" data-testid="tab-preferences">Preferências</TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="asaas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integração Asaas</CardTitle>
              <CardDescription>Configure o acesso à API do Asaas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asaas-token">Token de Acesso</Label>
                <Input
                  id="asaas-token"
                  type="password"
                  value={config.asaasToken}
                  onChange={(e) => setConfig({ ...config, asaasToken: e.target.value })}
                  data-testid="input-asaas-token"
                />
                <p className="text-xs text-muted-foreground">
                  Token de API do Asaas (Produção ou Sandbox)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="asaas-url">URL da API</Label>
                <Input
                  id="asaas-url"
                  value={config.asaasUrl}
                  onChange={(e) => setConfig({ ...config, asaasUrl: e.target.value })}
                  data-testid="input-asaas-url"
                />
                <p className="text-xs text-muted-foreground">
                  Produção: https://api.asaas.com/v3 | Sandbox: https://api-sandbox.asaas.com/v3
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolution API</CardTitle>
              <CardDescription>Configure a integração com WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="evolution-url">URL da Evolution API</Label>
                <Input
                  id="evolution-url"
                  value={config.evolutionUrl}
                  onChange={(e) => setConfig({ ...config, evolutionUrl: e.target.value })}
                  data-testid="input-evolution-url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evolution-instance">Nome da Instância</Label>
                <Input
                  id="evolution-instance"
                  value={config.evolutionInstance}
                  onChange={(e) => setConfig({ ...config, evolutionInstance: e.target.value })}
                  data-testid="input-evolution-instance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evolution-apikey">API Key</Label>
                <Input
                  id="evolution-apikey"
                  type="password"
                  value={config.evolutionApiKey}
                  onChange={(e) => setConfig({ ...config, evolutionApiKey: e.target.value })}
                  data-testid="input-evolution-apikey"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Envio</CardTitle>
              <CardDescription>Configure quando as mensagens devem ser enviadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dias-aviso">Dias de Aviso</Label>
                <Input
                  id="dias-aviso"
                  type="number"
                  value={config.diasAviso}
                  onChange={(e) => setConfig({ ...config, diasAviso: parseInt(e.target.value) })}
                  data-testid="input-dias-aviso"
                />
                <p className="text-xs text-muted-foreground">
                  Quantos dias antes do vencimento enviar o aviso
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template - Vence Hoje</CardTitle>
              <CardDescription>Mensagem enviada no dia do vencimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={8}
                value={config.messageTemplates.venceHoje}
                onChange={(e) => setConfig({
                  ...config,
                  messageTemplates: { ...config.messageTemplates, venceHoje: e.target.value }
                })}
                data-testid="textarea-template-vence-hoje"
              />
              <p className="text-xs text-muted-foreground">
                Variáveis disponíveis: {'{'}{'{'} link_fatura {'}'}{'}'}, {'{'}{'{'} valor {'}'}{'}'}, {'{'}{'{'} vencimento {'}'}{'}'}, {'{'}{'{'} cliente_nome {'}'}{'}'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template - Aviso</CardTitle>
              <CardDescription>Mensagem enviada X dias antes do vencimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={8}
                value={config.messageTemplates.aviso}
                onChange={(e) => setConfig({
                  ...config,
                  messageTemplates: { ...config.messageTemplates, aviso: e.target.value }
                })}
                data-testid="textarea-template-aviso"
              />
              <p className="text-xs text-muted-foreground">
                Variáveis disponíveis: {'{'}{'{'} link_fatura {'}'}{'}'}, {'{'}{'{'} valor {'}'}{'}'}, {'{'}{'{'} vencimento {'}'}{'}'}, {'{'}{'{'} cliente_nome {'}'}{'}'}, {'{'}{'{'} dias_aviso {'}'}{'}'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} data-testid="button-save-config">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
