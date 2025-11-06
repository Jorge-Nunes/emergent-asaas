import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Cobranca } from "@shared/schema";

interface CobrancaTableProps {
  cobrancas: Cobranca[];
  onSendMessage?: (cobranca: Cobranca) => void;
}

const statusConfig = {
  PENDING: { label: "Pendente", variant: "secondary" as const },
  RECEIVED: { label: "Recebido", variant: "default" as const },
  CONFIRMED: { label: "Confirmado", variant: "default" as const },
  OVERDUE: { label: "Vencido", variant: "destructive" as const },
};

const tipoConfig = {
  vence_hoje: { label: "Vence Hoje", variant: "destructive" as const },
  aviso: { label: "Aviso", variant: "secondary" as const },
  processada: { label: "Processada", variant: "outline" as const },
};

export function CobrancaTable({ cobrancas, onSendMessage }: CobrancaTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cobrancas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Nenhuma cobrança encontrada
              </TableCell>
            </TableRow>
          ) : (
            cobrancas.map((cobranca) => (
              <TableRow key={cobranca.id} data-testid={`row-cobranca-${cobranca.id}`} className="hover-elevate">
                <TableCell className="font-medium">{cobranca.customerName}</TableCell>
                <TableCell className="tabular-nums">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cobranca.value)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {format(new Date(cobranca.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[cobranca.status].variant}>
                    {statusConfig[cobranca.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {cobranca.tipo && (
                    <Badge variant={tipoConfig[cobranca.tipo].variant} className="text-xs">
                      {tipoConfig[cobranca.tipo].label}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(cobranca.invoiceUrl, '_blank')}
                      data-testid={`button-view-${cobranca.id}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    {onSendMessage && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSendMessage(cobranca)}
                        data-testid={`button-send-message-${cobranca.id}`}
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
