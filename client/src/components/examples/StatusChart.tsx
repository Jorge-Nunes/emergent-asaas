import { StatusChart } from '../StatusChart';

const mockData = [
  { name: 'Pendente', value: 45 },
  { name: 'Recebido', value: 28 },
  { name: 'Vencido', value: 12 },
  { name: 'Confirmado', value: 35 },
];

export default function StatusChartExample() {
  return (
    <div className="p-6">
      <StatusChart data={mockData} />
    </div>
  );
}
