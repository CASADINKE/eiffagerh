
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { generatePDFFromElement } from "@/utils/exportUtils";
import { toast } from "sonner";

interface SalaryHeaderProps {
  exportPayslips: (format?: string) => void;
}

export function SalaryHeader({ exportPayslips }: SalaryHeaderProps) {
  const handleExportPDF = async () => {
    try {
      const element = document.querySelector(".salary-content") as HTMLElement;
      if (!element) {
        toast.error("Impossible de générer le PDF. Élément non trouvé.");
        return;
      }
      
      await generatePDFFromElement(element, "salaires-export", {
        orientation: "landscape",
        format: "a4",
      });
      
      toast.success("Export PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-semibold">Gestion des salaires et paies</h1>
        <p className="text-muted-foreground">Suivez et gérez les salaires, bulletins de paie et indemnités</p>
      </div>
      <div className="flex gap-3">
        <Link to="/salary-payment">
          <Button>
            Paiement des salaires
          </Button>
        </Link>
      </div>
    </div>
  );
}
