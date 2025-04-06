
import { Clock, FileDown } from "lucide-react";
import { EmployeeTimeClockDialog } from "./EmployeeTimeClockDialog";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/utils/exportUtils";
import { useTimeEntries } from "@/hooks/timeEntries";
import { format } from "date-fns";
import { toast } from "sonner";

interface TimeTrackingHeaderProps {
  handleExport?: (format?: string) => void;
}

export const TimeTrackingHeader = ({ handleExport }: TimeTrackingHeaderProps) => {
  const { data: timeEntries = [] } = useTimeEntries();
  
  const handleExportToExcel = () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      
      // Filter entries for today
      const todaysEntries = timeEntries.filter(entry => entry.date === today);
      
      // Get active employees (clocked in today)
      const activeEmployeeIds = todaysEntries
        .filter(entry => !entry.clock_out)
        .map(entry => entry.employee_id);
      
      // Get all unique employee IDs from today's entries
      const allEmployeeIds = [...new Set(todaysEntries.map(entry => entry.employee_id))];
      
      // Prepare data for export
      const exportData = timeEntries
        .filter(entry => entry.date === today)
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
        `pointage-employes-${format(new Date(), 'yyyy-MM-dd')}`,
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
      
      toast.success('Export réussi');
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
        <Button 
          variant="outline"
          onClick={handleExportToExcel}
          className="w-full sm:w-auto"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Exporter Excel
        </Button>
        <EmployeeTimeClockDialog className="w-full sm:w-auto" />
      </div>
    </div>
  );
};
