
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TimeEntry } from "@/hooks/useTimeEntries";

// Function to export time entries to CSV
export const handleExportTimeEntries = (
  entries: TimeEntry[], 
  activeTab: string, 
  exportFormat = 'csv'
) => {
  if (entries.length === 0) {
    alert("Aucune donnée à exporter");
    return;
  }

  const now = format(new Date(), "yyyy-MM-dd_HH-mm", { locale: fr });
  const tabLabel = activeTab === 'today' 
    ? 'aujourdhui' 
    : activeTab === 'yesterday' 
      ? 'hier' 
      : 'historique';
  
  const fileName = `pointages_${tabLabel}_${now}`;

  if (exportFormat === 'csv') {
    exportTimeEntriesToCSV(entries, fileName);
  } else if (exportFormat === 'pdf') {
    exportTimeEntriesToPDF(entries, fileName);
  }
};

// Export to CSV format
const exportTimeEntriesToCSV = (entries: TimeEntry[], fileName: string) => {
  // CSV header
  const headers = [
    "ID",
    "Employé",
    "Département",
    "Date",
    "Heure d'entrée",
    "Heure de sortie",
    "Pause",
    "Durée",
    "Statut"
  ];
  
  // Map entries to CSV rows
  const rows = entries.map(entry => {
    const clockIn = format(new Date(entry.clock_in), "HH:mm", { locale: fr });
    const clockOut = entry.clock_out 
      ? format(new Date(entry.clock_out), "HH:mm", { locale: fr }) 
      : "";
    const date = format(new Date(entry.date), "dd/MM/yyyy", { locale: fr });
    const status = entry.clock_out ? "Terminé" : "Actif";
    const breakTime = `${entry.break_time || 0}m`;
    
    const hoursDiff = entry.clock_out 
      ? Math.floor((new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime()) / (1000 * 60 * 60)) 
      : "";
    
    const minutesDiff = entry.clock_out 
      ? Math.floor(((new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime()) / (1000 * 60)) % 60) 
      : "";
    
    const duration = entry.clock_out 
      ? `${hoursDiff}h ${minutesDiff}m` 
      : "";
    
    return [
      entry.id,
      entry.employee?.name || "Inconnu",
      entry.employee?.department || "Non assigné",
      date,
      clockIn,
      clockOut,
      breakTime,
      duration,
      status
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to PDF format
const exportTimeEntriesToPDF = (entries: TimeEntry[], fileName: string) => {
  // For now, just use CSV as PDF is not implemented yet
  alert("Export PDF non implémenté pour le moment, utilisation du format CSV à la place");
  exportTimeEntriesToCSV(entries, fileName);
};
