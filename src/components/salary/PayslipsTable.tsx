import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Payslip, PayslipStatus, PaymentMethod } from "@/services/payslipService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentProcessDialog } from "./PaymentProcessDialog";
import { EyeIcon, FileText, Download, Trash2 } from "lucide-react";

interface PayslipsTableProps {
  payslips: Payslip[];
  isLoading: boolean;
  onUpdateStatus: (payslipId: string, status: PayslipStatus, paymentMethod?: PaymentMethod, paymentDate?: string) => void;
  onDeletePayslip?: (payslipId: string) => void;
  onDownloadPayslip?: (payslip: Payslip) => void;
  isUpdating: boolean;
  isDeleting?: boolean;
  isDownloading?: boolean;
}

export const PayslipsTable = ({
  payslips,
  isLoading,
  onUpdateStatus,
  onDeletePayslip,
  onDownloadPayslip,
  isUpdating,
  isDeleting = false,
  isDownloading = false,
}: PayslipsTableProps) => {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [payslipToDelete, setPayslipToDelete] = useState<string | null>(null);
  
  const handleProcessPayment = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setDialogOpen(true);
  };
  
  const handleDeleteClick = (payslipId: string) => {
    setPayslipToDelete(payslipId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (payslipToDelete && onDeletePayslip) {
      onDeletePayslip(payslipToDelete);
    }
    setDeleteDialogOpen(false);
    setPayslipToDelete(null);
  };
  
  const handleDownload = (payslip: Payslip) => {
    if (onDownloadPayslip) {
      onDownloadPayslip(payslip);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">Chargement des bulletins de paie...</p>
      </div>
    );
  }
  
  if (!payslips?.length) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bulletin de paie</h3>
          <p className="mt-1 text-sm text-gray-500">
            Il n'y a pas de bulletins de paie disponibles.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matricule</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Salaire Net</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Mode Paiement</TableHead>
              <TableHead>Date Paiement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payslips.map((payslip) => (
              <TableRow key={payslip.id}>
                <TableCell className="font-medium">{payslip.matricule}</TableCell>
                <TableCell>{payslip.nom}</TableCell>
                <TableCell>{payslip.periode_paie}</TableCell>
                <TableCell>{payslip.net_a_payer.toLocaleString('fr-FR')} FCFA</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payslip.statut_paiement} />
                </TableCell>
                <TableCell>{payslip.mode_paiement || "-"}</TableCell>
                <TableCell>
                  {payslip.date_paiement 
                    ? format(new Date(payslip.date_paiement), 'dd MMM yyyy', { locale: fr }) 
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {onDownloadPayslip && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(payslip)}
                        disabled={isDownloading}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Télécharger</span>
                      </Button>
                    )}
                    
                    {onDeletePayslip && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(payslip.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProcessPayment(payslip)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Traiter
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <PaymentProcessDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        payslip={selectedPayslip}
        onConfirm={onUpdateStatus}
        isProcessing={isUpdating}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bulletin de paie ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
