
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PayslipStatus, PaymentMethod, Payslip } from "@/services/payslipService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslip: Payslip | null;
  onConfirm: (payslipId: string, status: PayslipStatus, paymentMethod?: PaymentMethod, paymentDate?: string) => void;
  isProcessing: boolean;
}

export const PaymentProcessDialog = ({
  open,
  onOpenChange,
  payslip,
  onConfirm,
  isProcessing,
}: PaymentProcessDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "none">("none");
  const [newStatus, setNewStatus] = useState<PayslipStatus | "none">("none");
  
  const handleConfirm = () => {
    if (!payslip) return;
    
    if (newStatus === 'Payé' && paymentMethod === "none") {
      toast.error("Veuillez sélectionner un mode de paiement");
      return;
    }
    
    onConfirm(
      payslip.id,
      newStatus as PayslipStatus,
      newStatus === 'Payé' ? paymentMethod as PaymentMethod : undefined
    );
  };
  
  const resetForm = () => {
    setPaymentMethod("none");
    setNewStatus("none");
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Traitement du bulletin de paie</DialogTitle>
          <DialogDescription>
            Modifier le statut du bulletin de paie et enregistrer le paiement.
          </DialogDescription>
        </DialogHeader>
        {payslip && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Matricule</p>
                <p className="font-medium">{payslip.matricule}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Employé</p>
                <p className="font-medium">{payslip.nom}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Période</p>
                <p className="font-medium">{payslip.periode_paie}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Montant</p>
                <p className="font-medium">{payslip.net_a_payer.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Statut actuel</p>
                <div className="mt-1">
                  <PaymentStatusBadge status={payslip.statut_paiement} />
                </div>
              </div>
              {payslip.mode_paiement && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Mode de paiement</p>
                  <p className="font-medium">{payslip.mode_paiement}</p>
                </div>
              )}
            </div>
            
            <div className="grid gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="status">Modifier le statut</Label>
                <Select 
                  value={newStatus} 
                  onValueChange={(value) => setNewStatus(value as PayslipStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sélectionner un statut</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Validé">Validé</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newStatus === 'Payé' && (
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Mode de paiement</Label>
                  <Select 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Sélectionner un mode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sélectionner un mode</SelectItem>
                      <SelectItem value="Virement">Virement bancaire</SelectItem>
                      <SelectItem value="Espèces">Espèces</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={newStatus === "none" || (newStatus === 'Payé' && paymentMethod === "none") || isProcessing}
          >
            {isProcessing ? "Traitement..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
