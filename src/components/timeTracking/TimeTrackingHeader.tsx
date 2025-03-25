
import { Clock } from "lucide-react";
import { EmployeeTimeClockDialog } from "./EmployeeTimeClockDialog";

interface TimeTrackingHeaderProps {
  handleExport?: (format?: string) => void;
}

export const TimeTrackingHeader = ({ handleExport }: TimeTrackingHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Pointage des employés</h1>
        <p className="text-muted-foreground">Gérez et suivez le temps de travail des employés</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <EmployeeTimeClockDialog className="w-full sm:w-auto" />
      </div>
    </div>
  );
};
