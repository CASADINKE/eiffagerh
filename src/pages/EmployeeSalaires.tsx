
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeSalaires } from "@/hooks/useSalaires";
import { SalaireTable } from "@/components/salary/SalaireTable";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function EmployeeSalaires() {
  const { matricule } = useParams<{ matricule: string }>();
  const { salaires, isLoading } = useEmployeeSalaires(matricule || "");
  const [isPrinting, setIsPrinting] = useState(false);
  
  if (!matricule) {
    return <div className="container mx-auto p-6">Identifiant d'employé manquant</div>;
  }
  
  // Fonction pour générer un PDF
  const generatePDF = async () => {
    if (!salaires || salaires.length === 0) return;
    
    setIsPrinting(true);
    
    try {
      const tableElement = document.getElementById('salaires-table');
      if (!tableElement) {
        throw new Error("Élément de table non trouvé");
      }
      
      const canvas = await html2canvas(tableElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
      pdf.text(`Bulletins de salaire - ${salaires[0].nom}`, 10, 10);
      pdf.save(`bulletins-${matricule}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    } finally {
      setIsPrinting(false);
    }
  };
  
  const employeeName = salaires && salaires.length > 0 ? salaires[0].nom : matricule;
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulletins de Salaire</h1>
          <p className="text-muted-foreground mt-1">
            Employé: <span className="font-medium">{employeeName}</span> (Matricule: {matricule})
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={generatePDF} disabled={isPrinting || !salaires || salaires.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
          <Button variant="outline" onClick={() => window.print()} disabled={!salaires || salaires.length === 0}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historique des bulletins</CardTitle>
          <CardDescription>
            Consultez l'historique de vos bulletins de salaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div id="salaires-table">
            <SalaireTable
              salaires={salaires || []}
              isLoading={isLoading}
              onUpdateStatus={() => {}}
              isUpdating={false}
              showActions={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
