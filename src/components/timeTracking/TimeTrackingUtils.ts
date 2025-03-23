import { format } from "date-fns";
import { exportToCSV } from "@/utils/exportUtils";
import { TimeEntry, calculateDuration } from "@/hooks/useTimeEntries";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

// Format time entries data for export with attendance status
export const formatDataForExport = (entries: TimeEntry[], allEmployees: any[] = []) => {
  const employeeAttendance = new Map();
  
  allEmployees.forEach(employee => {
    employeeAttendance.set(employee.id, {
      employee: employee.name || "Sans nom",
      department: employee.department || "Non assigné",
      status: "Non pointé",
      date: format(new Date(), "dd/MM/yyyy"),
      clock_in: "--:--",
      clock_out: "--:--",
      duration: "--:--",
      break_time: "--"
    });
  });
  
  entries.forEach(entry => {
    employeeAttendance.set(entry.employee_id, {
      date: format(new Date(entry.date), "dd/MM/yyyy"),
      employee: entry.employee?.name || "Sans nom",
      department: entry.employee?.department || "Non assigné",
      clock_in: format(new Date(entry.clock_in), "HH:mm"),
      clock_out: entry.clock_out ? format(new Date(entry.clock_out), "HH:mm") : "--:--",
      duration: calculateDuration(entry.clock_in, entry.clock_out, entry.break_time),
      break_time: `${entry.break_time}m`,
      status: entry.clock_out ? "Terminé" : "Actif"
    });
  });
  
  return Array.from(employeeAttendance.values());
};

// Generate PDF table for time entries
export const generatePDF = async (entries: TimeEntry[], dateFilter: string, periodFilter: string, allEmployees: any[] = []) => {
  try {
    if (entries.length === 0 && allEmployees.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }
    
    const filename = getExportFilename(dateFilter, periodFilter);
    const exportData = formatDataForExport(entries, allEmployees);
    
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '794px';
    container.style.backgroundColor = '#ffffff';
    
    const header = document.createElement('div');
    header.style.padding = '20px';
    header.style.textAlign = 'center';
    header.style.borderBottom = '1px solid #ddd';
    header.innerHTML = `
      <h1 style="margin: 0; font-size: 24px;">Rapport de Pointage</h1>
      <p style="margin: 8px 0 0; font-size: 16px;">Période: ${filename.replace('pointages_', '').replace(/_/g, ' ')}</p>
    `;
    container.appendChild(header);
    
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr style="background-color: #f3f4f6; font-weight: bold; text-align: left;">
        <th style="padding: 10px; border: 1px solid #ddd;">Date</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Employé</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Département</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Entrée</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Sortie</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Durée</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Pause</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Statut</th>
      </tr>
    `;
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    exportData.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9fafb';
      
      tr.innerHTML = `
        <td style="padding: 10px; border: 1px solid #ddd;">${row.date}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${row.employee}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${row.department}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${row.clock_in}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${row.clock_out}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${row.duration}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${row.break_time}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${row.status}</td>
      `;
      
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
    
    const footer = document.createElement('div');
    footer.style.padding = '20px';
    footer.style.marginTop = '20px';
    footer.style.borderTop = '1px solid #ddd';
    footer.style.fontSize = '12px';
    footer.style.color = '#666';
    footer.innerHTML = `
      <p>Document généré le ${format(new Date(), "dd/MM/yyyy à HH:mm")}</p>
    `;
    container.appendChild(footer);
    
    document.body.appendChild(container);
    
    toast.info("Génération du PDF en cours...");
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
    
    document.body.removeChild(container);
    
    toast.success("Rapport PDF généré avec succès");
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error("Erreur lors de la génération du PDF");
  }
};

// Handle export function with format options
export const handleExportTimeEntries = (
  timeEntries: TimeEntry[], 
  dateFilter: string, 
  periodFilter: string,
  format: string = 'csv',
  allEmployees: any[] = []
) => {
  if (timeEntries.length === 0 && allEmployees.length === 0) {
    toast.error("Aucune donnée à exporter");
    return;
  }
  
  const exportData = formatDataForExport(timeEntries, allEmployees);
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
  
  if (format === 'csv') {
    exportToCSV(exportData, filename, headers);
    toast.success("Rapport CSV généré avec succès");
  } 
  else if (format === 'excel') {
    exportToCSV(exportData, filename, headers);
    toast.success("Rapport Excel généré avec succès");
  }
  else if (format === 'pdf') {
    generatePDF(timeEntries, dateFilter, periodFilter, allEmployees);
  }
};
