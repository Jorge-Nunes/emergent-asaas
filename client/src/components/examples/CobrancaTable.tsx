import { CobrancaTable } from '../CobrancaTable';
import type { Cobranca } from '@shared/schema';

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
    description: 'Mensalidade',
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
    description: 'Mensalidade',
    tipo: 'aviso',
  },
];

export default function CobrancaTableExample() {
  return (
    <div className="p-6">
      <CobrancaTable 
        cobrancas={mockCobrancas}
        onSendMessage={(cobranca) => console.log('Send message to:', cobranca.customerName)}
      />
    </div>
  );
}
