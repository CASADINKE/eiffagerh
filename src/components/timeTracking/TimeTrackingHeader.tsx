
import { FileDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeTimeClockDialog } from "./EmployeeTimeClockDialog";

interface TimeTrackingHeaderProps {
  handleExport: (format?: string) => void;
}

export const TimeTrackingHeader = ({ handleExport }: TimeTrackingHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Pointage des employés</h1>
        <p className="text-muted-foreground">Gérez et suivez le temps de travail des employés</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <EmployeeTimeClockDialog className="w-full sm:w-auto text-lg py-3 px-6 h-auto" />
        
        <Button variant="outline" onClick={() => handleExport()} className="w-full sm:w-auto">
          <FileDown size={16} className="mr-2" />
          Exporter
        </Button>
      </div>
    </div>
  );
};
