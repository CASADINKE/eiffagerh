
import { Users, Clock, Calendar } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface TimeTrackingStatsProps {
  activeEmployeeCount: number;
  averageHours: string | number;
  totalEntries: number;
  totalEmployees?: number;
}

export const TimeTrackingStats = ({
  activeEmployeeCount,
  averageHours,
  totalEntries,
  totalEmployees = 0,
}: TimeTrackingStatsProps) => {
  const absentCount = Math.max(0, totalEmployees - activeEmployeeCount);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Employés pointés"
        value={activeEmployeeCount.toString()}
        icon={<Users className="text-blue-500" />}
        className="bg-blue-50 border-blue-200"
      />
      <StatCard
        title="Moyenne d'heures aujourd'hui"
        value={`${averageHours}h`}
        icon={<Clock className="text-purple-500" />}
        className="bg-purple-50 border-purple-200"
      />
      <StatCard
        title="Employés non pointés"
        value={absentCount.toString()}
        icon={<Calendar className="text-red-500" />}
        className="bg-red-50 border-red-200"
      />
    </div>
  );
};
