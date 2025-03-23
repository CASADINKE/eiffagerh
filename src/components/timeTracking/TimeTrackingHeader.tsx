
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeTimeClockDialog } from "@/components/timeTracking/EmployeeTimeClockDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TimeTrackingHeaderProps {
  handleExport: (format: string) => void;
}

export const TimeTrackingHeader = ({ handleExport }: TimeTrackingHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-semibold">Pointage</h1>
        <p className="text-muted-foreground">Suivi des présences et des heures de travail des employés</p>
      </div>
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              <span>Exporter le rapport</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              Exporter en CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')}>
              Exporter en Excel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              Exporter en PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <EmployeeTimeClockDialog className="gap-2" />
      </div>
    </div>
  );
};
