import { useState } from "react";
import { CobrancaTable } from "@/components/CobrancaTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Cobranca } from "@shared/schema";

// TODO: Remove mock data
const mockCobrancas: Cobranca[] = [
  {
    id: '1',
    customer: 'cus_1',
    customerName: 'João Silva',
    customerPhone: '11999999999',
    value: 150.00,
    dueDate: new Date().toISOString(),
    status: 'PENDING',
    invoiceUrl: 'https://asaas.com/invoice/1',
    description: 'Mensalidade Janeiro',
    tipo: 'vence_hoje',
  },
  {
    id: '2',
    customer: 'cus_2',
    customerName: 'Maria Santos',
    customerPhone: '11988888888',
    value: 250.00,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    invoiceUrl: 'https://asaas.com/invoice/2',
    description: 'Mensalidade Janeiro',
    tipo: 'aviso',
  },
  {
    id: '3',
    customer: 'cus_3',
    customerName: 'Pedro Costa',
    customerPhone: '11977777777',
    value: 180.00,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'OVERDUE',
    invoiceUrl: 'https://asaas.com/invoice/3',
    description: 'Mensalidade Dezembro',
  },
  {
    id: '4',
    customer: 'cus_4',
    customerName: 'Ana Oliveira',
    customerPhone: '11966666666',
    value: 200.00,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    invoiceUrl: 'https://asaas.com/invoice/4',
    description: 'Mensalidade Janeiro',
  },
];

export default function Cobrancas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tipoFilter, setTipoFilter] = useState<string>("all");

  const filteredCobrancas = mockCobrancas.filter((cobranca) => {
    const matchesSearch = cobranca.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || cobranca.status === statusFilter;
    const matchesTipo = tipoFilter === "all" || cobranca.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const handleSendMessage = (cobranca: Cobranca) => {
    console.log('Enviando mensagem para:', cobranca.customerName);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Cobranças</h1>
        <p className="text-muted-foreground mt-1">Gerencie todas as cobranças pendentes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-cliente"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="RECEIVED">Recebido</SelectItem>
            <SelectItem value="CONFIRMED">Confirmado</SelectItem>
            <SelectItem value="OVERDUE">Vencido</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-tipo-filter">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="vence_hoje">Vence Hoje</SelectItem>
            <SelectItem value="aviso">Aviso</SelectItem>
            <SelectItem value="processada">Processada</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" data-testid="button-filter">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <CobrancaTable cobrancas={filteredCobrancas} onSendMessage={handleSendMessage} />
    </div>
  );
}
