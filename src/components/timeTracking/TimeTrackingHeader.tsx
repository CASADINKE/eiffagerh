
import { Clock, FileDown, Calendar } from "lucide-react";
import { EmployeeTimeClockDialog } from "./EmployeeTimeClockDialog";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/utils/exportUtils";
import { useTimeEntries } from "@/hooks/timeEntries";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

interface TimeTrackingHeaderProps {
  handleExport?: (format?: string) => void;
}

export const TimeTrackingHeader = ({ handleExport }: TimeTrackingHeaderProps) => {
  const { data: timeEntries = [] } = useTimeEntries();
  const [exportDate, setExportDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handleExportToExcel = () => {
    try {
      const selectedDate = format(exportDate, "yyyy-MM-dd");
      
      // Filter entries for selected date
      const selectedDateEntries = timeEntries.filter(entry => entry.date === selectedDate);
      
      if (selectedDateEntries.length === 0) {
        toast.warning(`Aucune donnée pour le ${format(exportDate, "dd/MM/yyyy")}`);
        return;
      }
      
      // Get active employees (clocked in on selected date)
      const activeEmployeeIds = selectedDateEntries
        .filter(entry => !entry.clock_out)
        .map(entry => entry.employee_id);
      
      // Get all unique employee IDs from selected date entries
      const allEmployeeIds = [...new Set(selectedDateEntries.map(entry => entry.employee_id))];
      
      // Prepare data for export
      const exportData = timeEntries
        .filter(entry => entry.date === selectedDate)
        .map(entry => {
          const isActive = !entry.clock_out;
          return {
            nom: entry.employee.name,
            matricule: entry.employee.matricule,
            site: entry.employee.site || '',
            statut: isActive ? 'Présent' : 'Sorti',
            heure_entree: format(new Date(entry.clock_in), 'HH:mm'),
            heure_sortie: entry.clock_out ? format(new Date(entry.clock_out), 'HH:mm') : '',
            notes: entry.notes || ''
          };
        });
      
      // Export to CSV/Excel
      exportToCSV(
        exportData,
        `pointage-employes-${format(exportDate, 'dd-MM-yyyy')}`,
        {
          nom: 'Nom',
          matricule: 'Matricule',
          site: 'Site',
          statut: 'Statut',
          heure_entree: 'Heure d\'entrée',
          heure_sortie: 'Heure de sortie',
          notes: 'Notes'
        }
      );
      
      toast.success(`Export réussi pour le ${format(exportDate, "dd/MM/yyyy")}`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export');
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Pointage des employés</h1>
        <p className="text-muted-foreground">Gérez et suivez le temps de travail des employés</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="rounded-r-none border-r-0 whitespace-nowrap"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {format(exportDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                locale={fr}
                selected={exportDate}
                onSelect={(date) => {
                  if (date) {
                    setExportDate(date);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button 
            variant="outline"
            onClick={handleExportToExcel}
            className="rounded-l-none border-l-0 w-full sm:w-auto"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exporter Excel
          </Button>
        </div>
        <EmployeeTimeClockDialog className="w-full sm:w-auto" />
      </div>
    </div>
  );
};
