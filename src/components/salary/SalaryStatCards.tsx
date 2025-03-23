
import { Calendar } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface SalaryStatCardsProps {
  totalSalaryExpense: number;
  averageSalary: number;
}

export function SalaryStatCards({ totalSalaryExpense, averageSalary }: SalaryStatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
      <StatCard
        title="Prochaine date de paie"
        value="30 Juin, 2024"
        icon={<Calendar />}
      />
    </div>
  );
}
