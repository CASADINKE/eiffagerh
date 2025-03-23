
import { Users, Clock, Calendar } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface TimeTrackingStatsProps {
  activeEmployeeCount: number;
  averageHours: string | number;
  totalEntries: number;
}

export const TimeTrackingStats = ({
  activeEmployeeCount,
  averageHours,
  totalEntries,
}: TimeTrackingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Employés actifs"
        value={activeEmployeeCount.toString()}
        icon={<Users />}
      />
      <StatCard
        title="Moyenne d'heures aujourd'hui"
        value={`${averageHours}h`}
        icon={<Clock />}
      />
      <StatCard
        title="Pointages à approuver"
        value={totalEntries.toString()}
        icon={<Calendar />}
      />
    </div>
  );
};
