import { MetricCard } from '../MetricCard';
import { DollarSign } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <MetricCard
        title="Total Pendente"
        value="R$ 12.450,00"
        icon={DollarSign}
        trend={{ value: 5.2, isPositive: false }}
      />
      <MetricCard
        title="Vence Hoje"
        value="8"
        icon={DollarSign}
        trend={{ value: 12.3, isPositive: true }}
      />
    </div>
  );
}
