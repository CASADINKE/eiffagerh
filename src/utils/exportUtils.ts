
/**
 * Fonction utilitaire pour exporter des données au format CSV
 */
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
