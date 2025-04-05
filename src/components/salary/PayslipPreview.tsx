
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { Payslip } from "@/services/payslipService";
import { PayslipGenerator } from "./PayslipGenerator";
import { generatePDFFromElement } from "@/utils/exportUtils";
import { toast } from "sonner";

interface PayslipPreviewProps {
  payslip: Payslip | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PayslipPreview({ payslip, isOpen, onClose }: PayslipPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  if (!payslip) return null;
  
  // Convert Payslip to Salaire type for compatibility with PayslipGenerator
  const salaire = {
    id: payslip.id,
    matricule: payslip.matricule,
    nom: payslip.nom,
    periode_paie: payslip.periode_paie,
    salaire_base: payslip.salaire_base,
    sursalaire: payslip.sursalaire,
    indemnite_deplacement: payslip.indemnite_deplacement,
    prime_transport: payslip.prime_transport,
    retenue_ir: payslip.retenue_ir,
    ipres_general: payslip.ipres_general,
    trimf: payslip.trimf,
    net_a_payer: payslip.net_a_payer,
    statut_paiement: payslip.statut_paiement,
    mode_paiement: payslip.mode_paiement,
    date_paiement: payslip.date_paiement
  };
  
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    try {
      toast.loading("Génération du PDF en cours...");
      
      await generatePDFFromElement(
        printRef.current,
        `bulletin-paie-${payslip.matricule}-${payslip.periode_paie.replace('/', '-')}`,
        { scale: 2 }
      );
      
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-auto print:shadow-none print:border-none print:p-0 print:max-h-none">
        <DialogHeader className="print:hidden">
          <DialogTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Bulletin de paie - {payslip.nom}
          </DialogTitle>
          <div className="flex space-x-2 mt-2">
            <Button variant="outline" onClick={handleDownloadPDF} className="hover:bg-gray-100">
              Télécharger PDF
            </Button>
            <Button variant="outline" onClick={onClose} className="hover:bg-gray-100">
              <X className="mr-2 h-4 w-4" />
              Fermer
            </Button>
          </div>
        </DialogHeader>
        
        <div ref={printRef} className="bg-white payslip-content print-container">
          <PayslipGenerator salaire={salaire} onClose={() => {}} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
