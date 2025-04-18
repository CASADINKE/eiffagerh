
import { Clock, FileDown, Calendar } from "lucide-react";
import { EmployeeTimeClockDialog } from "./EmployeeTimeClockDialog";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/utils/exportUtils";
import { useTimeEntries } from "@/hooks/timeEntries";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

interface TimeTrackingHeaderProps {
  handleExport?: (format?: string) => void;
}

export const TimeTrackingHeader = ({ handleExport }: TimeTrackingHeaderProps) => {
  const { data: timeEntries = [] } = useTimeEntries();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(),
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const handleExportToExcel = () => {
    try {
      if (!dateRange.from) {
        toast.error("Veuillez sélectionner une date de début");
        return;
      }
      
      const fromDate = format(dateRange.from, "yyyy-MM-dd");
      const toDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : fromDate;
      
      // Filtrer les entrées pour la plage de dates sélectionnée
      const filteredEntries = timeEntries.filter(entry => {
        return entry.date >= fromDate && entry.date <= toDate;
      });
      
      if (filteredEntries.length === 0) {
        toast.error("Aucune donnée disponible pour cette période");
        return;
      }
      
      // Préparer les données pour l'export
      const exportData = filteredEntries.map(entry => {
        const isActive = !entry.clock_out;
        return {
          nom: entry.employee.name,
          matricule: entry.employee.matricule,
          date: format(new Date(entry.date), 'dd/MM/yyyy'),
          site: entry.employee.site || '',
          statut: isActive ? 'Présent' : 'Sorti',
          heure_entree: format(new Date(entry.clock_in), 'HH:mm'),
          heure_sortie: entry.clock_out ? format(new Date(entry.clock_out), 'HH:mm') : '',
          notes: entry.notes || ''
        };
      });
      
      // Exporter en CSV/Excel
      const dateRangeStr = dateRange.to && dateRange.from !== dateRange.to 
        ? `${format(dateRange.from, 'dd-MM-yyyy')}_au_${format(dateRange.to, 'dd-MM-yyyy')}`
        : format(dateRange.from, 'dd-MM-yyyy');
      
      exportToCSV(
        exportData,
        `pointage-employes-${dateRangeStr}`,
        {
          nom: 'Nom',
          matricule: 'Matricule',
          date: 'Date',
          site: 'Site',
          statut: 'Statut',
          heure_entree: 'Heure d\'entrée',
          heure_sortie: 'Heure de sortie',
          notes: 'Notes'
        }
      );
      
      toast.success('Export réussi');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export');
    }
  };
  
  const formatDateRange = () => {
    if (!dateRange.from) return "Sélectionner dates";
    
    if (!dateRange.to) {
      return format(dateRange.from, "dd/MM/yyyy");
    }
    
    if (format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd")) {
      return format(dateRange.from, "dd/MM/yyyy");
    }
    
    return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300">Pointage des employés</h1>
        <p className="text-muted-foreground">Gérez et suivez le temps de travail des employés</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200">
              <Calendar className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                if (range) {
                  setDateRange({
                    from: range.from,
                    to: range.to || range.from
                  });
                  if (range.from) {
                    setCalendarOpen(false);
                  }
                }
              }}
              locale={fr}
              initialFocus
              className="rounded-md border border-blue-200 dark:border-blue-800"
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline"
          onClick={handleExportToExcel}
          className="w-full sm:w-auto bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800 transition-all duration-200"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Exporter Excel
        </Button>
        <EmployeeTimeClockDialog className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200" />
      </div>
    </div>
  );
};
