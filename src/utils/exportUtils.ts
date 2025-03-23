
/**
 * Fonction utilitaire pour exporter des données au format CSV
 */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
) {
  // Si aucune donnée, on arrête
  if (!data || !data.length) {
    console.error("Aucune donnée à exporter");
    return;
  }

  // Définition des entêtes
  const headerKeys = headers ? Object.keys(headers) : Object.keys(data[0]);
  const headerValues = headers ? Object.values(headers) : headerKeys;
  
  // Création des lignes CSV
  const csvRows = [];
  
  // Ajout des entêtes
  csvRows.push(headerValues.join(","));
  
  // Ajout des données
  for (const row of data) {
    const values = headerKeys.map(key => {
      const value = row[key];
      // Échapper les virgules et les guillemets
      const escaped = value !== null && value !== undefined 
        ? String(value).replace(/"/g, '""') 
        : '';
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  
  // Jointure des lignes avec des sauts de ligne
  const csvContent = csvRows.join("\n");
  
  // Création d'un blob avec les données CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Création d'un URL pour le téléchargement
  const url = URL.createObjectURL(blob);
  
  // Création d'un lien pour le téléchargement
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  
  // Ajout du lien au DOM et déclenchement du téléchargement
  document.body.appendChild(link);
  link.click();
  
  // Nettoyage
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Fonction utilitaire pour formater une date en français
 */
export function formatDateFR(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Fonction utilitaire pour générer un PDF à partir d'un élément HTML
 */
export async function generatePDFFromElement(
  element: HTMLElement,
  filename: string,
  options: {
    orientation?: 'portrait' | 'landscape';
    format?: string;
    scale?: number;
  } = {}
) {
  try {
    const {
      orientation = 'portrait',
      format = 'a4',
      scale = 2
    } = options;
    
    // Préparer l'élément pour l'export
    const originalDisplay = element.style.display;
    const originalPosition = element.style.position;
    const originalOverflow = element.style.overflow;
    
    element.style.overflow = 'visible';
    
    // Generate the PDF
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });
    
    // Restaurer l'élément
    element.style.display = originalDisplay;
    element.style.position = originalPosition;
    element.style.overflow = originalOverflow;
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    });
    
    const pdfWidth = orientation === 'portrait' ? 210 : 297; // A4 dimensions
    const imgWidth = pdfWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
}
