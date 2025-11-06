import { ExecutionLogTable } from '../ExecutionLogTable';
import type { ExecutionLog } from '@shared/schema';

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

export default function ExecutionLogTableExample() {
  return (
    <div className="p-6">
      <ExecutionLogTable logs={mockLogs} />
    </div>
  );
}
