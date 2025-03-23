import { FileDown, File, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeTimeClockDialog } from "./EmployeeTimeClockDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <EmployeeTimeClockDialog className="w-full sm:w-auto" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <FileDown size={16} className="mr-2" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <FileText className="mr-2 h-4 w-4" />
              Exporter en CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              <File className="mr-2 h-4 w-4" />
              Exporter en PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
