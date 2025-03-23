
import { FileDown, File, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileDown size={16} />
              <span>Exporter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportPayslips('csv')}>
              <FileText className="mr-2 h-4 w-4" />
              Exporter les paiements en CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF}>
              <File className="mr-2 h-4 w-4" />
              Exporter tout en PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to="/salary-payment">
          <Button>
            Paiement des salaires
          </Button>
        </Link>
      </div>
    </div>
  );
}
