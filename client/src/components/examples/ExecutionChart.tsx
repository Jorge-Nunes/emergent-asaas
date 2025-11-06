import { ExecutionChart } from '../ExecutionChart';

const mockData = [
  { date: '01/01', mensagens: 45, erros: 2 },
  { date: '02/01', mensagens: 52, erros: 1 },
  { date: '03/01', mensagens: 38, erros: 3 },
  { date: '04/01', mensagens: 61, erros: 0 },
  { date: '05/01', mensagens: 48, erros: 2 },
  { date: '06/01', mensagens: 55, erros: 1 },
  { date: '07/01', mensagens: 43, erros: 0 },
];

export default function ExecutionChartExample() {
  return (
    <div className="p-6">
      <ExecutionChart data={mockData} />
    </div>
  );
}
