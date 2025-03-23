
import { format } from "date-fns";
import { exportToCSV } from "@/utils/exportUtils";
import { TimeEntry, calculateDuration } from "@/hooks/useTimeEntries";
import { toast } from "sonner";

// Get export filename based on filters
export const getExportFilename = (dateFilter: string, periodFilter: string): string => {
  const today = new Date();
  const month = today.toLocaleString('fr', { month: 'long' });
  const year = today.getFullYear();
  
  if (dateFilter === "today") {
    return `pointages_${format(today, 'yyyy-MM-dd')}`;
  } else if (dateFilter === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return `pointages_${format(yesterday, 'yyyy-MM-dd')}`;
  } else {
    if (periodFilter === "month") {
      return `pointages_${month}_${year}`;
    } else if (periodFilter === "quarter") {
      const quarter = Math.floor(today.getMonth() / 3) + 1;
      return `pointages_T${quarter}_${year}`;
    } else {
      return `pointages_annee_${year}`;
    }
  }
};

// Format time entries data for export
export const formatDataForExport = (entries: TimeEntry[]) => {
  return entries.map(entry => ({
    date: format(new Date(entry.date), "dd/MM/yyyy"),
    employee: entry.employee?.name || "Sans nom",
    department: entry.employee?.department || "Non assigné",
    clock_in: format(new Date(entry.clock_in), "HH:mm"),
    clock_out: entry.clock_out ? format(new Date(entry.clock_out), "HH:mm") : "--:--",
    duration: calculateDuration(entry.clock_in, entry.clock_out, entry.break_time),
    break_time: `${entry.break_time}m`,
    status: entry.clock_out ? "Terminé" : "Actif"
  }));
};

// Handle export function
export const handleExportTimeEntries = (
  timeEntries: TimeEntry[], 
  dateFilter: string, 
  periodFilter: string,
  format: string = 'csv'
) => {
  if (timeEntries.length === 0) {
    toast.error("Aucune donnée à exporter");
    return;
  }
  
  const exportData = formatDataForExport(timeEntries);
  const filename = getExportFilename(dateFilter, periodFilter);
  
  const headers = {
    date: "Date",
    employee: "Employé",
    department: "Département",
    clock_in: "Entrée",
    clock_out: "Sortie",
    duration: "Durée",
    break_time: "Pause",
    status: "Statut"
  };
  
  exportToCSV(exportData, filename, headers);
};
