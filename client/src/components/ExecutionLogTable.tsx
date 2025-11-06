import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ExecutionLog } from "@shared/schema";
import { CheckCircle2, XCircle } from "lucide-react";

interface ExecutionLogTableProps {
  logs: ExecutionLog[];
}

export function ExecutionLogTable({ logs }: ExecutionLogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Horário</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Nenhum log encontrado
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} data-testid={`log-${log.id}`} className="hover-elevate">
                <TableCell className="tabular-nums text-sm">
                  {format(new Date(log.timestamp), 'HH:mm:ss', { locale: ptBR })}
                </TableCell>
                <TableCell className="font-medium">{log.customerName}</TableCell>
                <TableCell className="tabular-nums">{log.customerPhone}</TableCell>
                <TableCell>
                  <Badge variant={log.tipo === 'vence_hoje' ? 'destructive' : 'secondary'} className="text-xs">
                    {log.tipo === 'vence_hoje' ? 'Vence Hoje' : 'Aviso'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {log.status === 'success' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-chart-2" />
                        <span className="text-sm text-chart-2">Enviado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">Erro</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {log.erro || log.mensagem || '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
