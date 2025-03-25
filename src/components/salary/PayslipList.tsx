
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { BulletinPaie, getAllBulletinsPaie, getBulletinPaieById } from "@/services/payslipService";
import { toast } from "sonner";
import jsPDF from "jspdf";

export default function PayslipList() {
  const [payslips, setPayslips] = useState<BulletinPaie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const data = await getAllBulletinsPaie();
      setPayslips(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des bulletins de paie:", error);
      toast.error("Impossible de charger les bulletins de paie");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayslip = (id: string) => {
    // Implémenter la visualisation du bulletin
    toast.info("Fonctionnalité de visualisation à venir");
  };

  const handleDownloadPayslip = async (id: string) => {
    try {
      // Récupérer les détails du bulletin de paie
      const payslip = await getBulletinPaieById(id);
      
      if (!payslip) {
        toast.error("Bulletin de paie non trouvé");
        return;
      }
      
      // Générer le PDF
      generatePayslipPDF(payslip);
      toast.success("Bulletin de paie téléchargé");
    } catch (error) {
      console.error("Erreur lors du téléchargement du bulletin:", error);
      toast.error("Impossible de télécharger le bulletin de paie");
    }
  };

  const generatePayslipPDF = (payslip: BulletinPaie) => {
    const doc = new jsPDF();
    
    // Ajouter le logo ou l'en-tête de l'entreprise
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BULLETIN DE PAIE", 105, 20, { align: "center" });
    
    // Informations de l'entreprise
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("EIFFAGE ENERGIE T&D Sénégal", 105, 30, { align: "center" });
    doc.text("AV PETIT MBAO X RTE DES BRAS BP 29389 DAKAR SÉNÉGAL", 105, 35, { align: "center" });
    
    // Ligne séparatrice
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 40, 190, 40);
    
    // Informations de l'employé
    doc.setFontSize(11);
    doc.text(`Matricule: ${payslip.matricule}`, 20, 50);
    doc.text(`Nom: ${payslip.nom}`, 20, 57);
    doc.text(`Période de paie: ${payslip.periode_paie}`, 20, 64);
    
    // Détails du salaire
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DÉTAILS DU SALAIRE", 105, 80, { align: "center" });
    
    // Tableau des composants du salaire
    doc.setFont("helvetica", "normal");
    doc.text("Description", 30, 90);
    doc.text("Montant (FCFA)", 150, 90);
    
    let yPosition = 100;
    
    // Éléments du salaire
    doc.text("Salaire de base", 30, yPosition);
    doc.text(`${payslip.salaire_base.toLocaleString()}`, 150, yPosition);
    yPosition += 7;
    
    if (payslip.sursalaire > 0) {
      doc.text("Sursalaire", 30, yPosition);
      doc.text(`${payslip.sursalaire.toLocaleString()}`, 150, yPosition);
      yPosition += 7;
    }
    
    if (payslip.prime_transport > 0) {
      doc.text("Prime de transport", 30, yPosition);
      doc.text(`${payslip.prime_transport.toLocaleString()}`, 150, yPosition);
      yPosition += 7;
    }
    
    if (payslip.indemnite_deplacement > 0) {
      doc.text("Indemnité de déplacement", 30, yPosition);
      doc.text(`${payslip.indemnite_deplacement.toLocaleString()}`, 150, yPosition);
      yPosition += 7;
    }
    
    // Ligne pour le total brut
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL BRUT", 30, yPosition);
    doc.text(`${payslip.total_brut.toLocaleString()}`, 150, yPosition);
    yPosition += 12;
    
    // Déductions
    doc.setFont("helvetica", "bold");
    doc.text("DÉDUCTIONS", 105, yPosition, { align: "center" });
    yPosition += 7;
    
    doc.setFont("helvetica", "normal");
    
    if (payslip.retenue_ir > 0) {
      doc.text("Retenue IR", 30, yPosition);
      doc.text(`-${payslip.retenue_ir.toLocaleString()}`, 150, yPosition);
      yPosition += 7;
    }
    
    if (payslip.ipres_general > 0) {
      doc.text("IPRES Général", 30, yPosition);
      doc.text(`-${payslip.ipres_general.toLocaleString()}`, 150, yPosition);
      yPosition += 7;
    }
    
    if (payslip.trimf > 0) {
      doc.text("TRIMF", 30, yPosition);
      doc.text(`-${payslip.trimf.toLocaleString()}`, 150, yPosition);
      yPosition += 7;
    }
    
    // Ligne pour le total des déductions
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 7;
    
    // Calcul du total des déductions
    const totalDeductions = payslip.retenue_ir + payslip.ipres_general + payslip.trimf;
    
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DÉDUCTIONS", 30, yPosition);
    doc.text(`-${totalDeductions.toLocaleString()}`, 150, yPosition);
    yPosition += 12;
    
    // Ligne séparatrice avant le net à payer
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Net à payer
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("NET À PAYER", 30, yPosition);
    doc.text(`${payslip.net_a_payer.toLocaleString()} FCFA`, 150, yPosition);
    
    // Pied de page
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Ce document a une valeur informative et ne constitue pas une pièce comptable officielle.", 105, 280, { align: "center" });
    
    // Enregistrer le PDF
    doc.save(`bulletin_paie_${payslip.matricule}_${payslip.periode_paie.replace(/\s/g, "_")}.pdf`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Liste des Bulletins de Paie</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Chargement des bulletins de paie...
          </div>
        ) : payslips.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Aucun bulletin de paie trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead className="text-right">Salaire brut</TableHead>
                  <TableHead className="text-right">Net à Payer</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">{payslip.matricule}</TableCell>
                    <TableCell>{payslip.nom}</TableCell>
                    <TableCell>{payslip.periode_paie}</TableCell>
                    <TableCell className="text-right">{payslip.total_brut.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-right">{payslip.net_a_payer.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleViewPayslip(payslip.id)}
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleDownloadPayslip(payslip.id)}
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
