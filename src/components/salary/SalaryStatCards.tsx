
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface SalaryStatCardsProps {
  totalSalaryExpense: number;
  averageSalary: number;
}

export function SalaryStatCards({ totalSalaryExpense, averageSalary }: SalaryStatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Masse salariale mensuelle"
        value={`${totalSalaryExpense.toLocaleString()} FCFA`}
        icon={<DollarSign />}
        trend={{ value: 3.2, positive: true }}
      />
      <StatCard
        title="Salaire moyen"
        value={`${averageSalary.toLocaleString()} FCFA`}
        icon={<TrendingUp />}
        trend={{ value: 1.5, positive: true }}
      />
      <StatCard
        title="Prochaine date de paie"
        value="30 Juin, 2024"
        icon={<Calendar />}
      />
    </div>
  );
}
