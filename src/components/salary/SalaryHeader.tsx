
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalaryPaymentDialog } from "@/components/salary/SalaryPaymentDialog";

interface SalaryHeaderProps {
  exportPayslips: () => void;
}

export function SalaryHeader({ exportPayslips }: SalaryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-semibold">Gestion des salaires et paies</h1>
        <p className="text-muted-foreground">Suivez et gérez les salaires, bulletins de paie et indemnités</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={exportPayslips}>
          <Download size={16} />
          <span>Exporter les bulletins</span>
        </Button>
        <SalaryPaymentDialog />
        <Button>Générer les bulletins de paie</Button>
      </div>
    </div>
  );
}
