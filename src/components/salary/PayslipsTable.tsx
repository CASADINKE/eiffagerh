
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Payslip, PaymentMethod, PayslipStatus } from "@/services/payslipService";
import { Calendar as CalendarIcon, Check, MoreHorizontal, Trash2, Eye, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PayslipPreview } from "./PayslipPreview";

interface PayslipsTableProps {
  payslips: Payslip[];
  isLoading: boolean;
  onUpdateStatus: (
    payslipId: string, 
    status: PayslipStatus, 
    paymentMethod?: string, 
    paymentDate?: string
  ) => void;
  onDeletePayslip: (payslipId: string) => void;
  onDownloadPayslip: (payslip: Payslip) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isDownloading: boolean;
}

export function PayslipsTable({
  payslips,
  isLoading,
  onUpdateStatus,
  onDeletePayslip,
  onDownloadPayslip,
  isUpdating,
  isDeleting,
  isDownloading
}: PayslipsTableProps) {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PayslipStatus>("En attente");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | "">("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleStatusUpdate = () => {
    if (!selectedPayslip) return;
    
    onUpdateStatus(
      selectedPayslip.id,
      selectedStatus,
      selectedPaymentMethod || undefined,
      selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
    );
    
    setIsUpdateDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedPayslip) return;
    onDeletePayslip(selectedPayslip.id);
    setIsDeleteDialogOpen(false);
  };
  
  const handleOpenUpdateDialog = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setSelectedStatus(payslip.statut_paiement);
    setSelectedPaymentMethod(payslip.mode_paiement || "");
    setSelectedDate(payslip.date_paiement ? new Date(payslip.date_paiement) : undefined);
    setIsUpdateDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDownload = (payslip: Payslip) => {
    onDownloadPayslip(payslip);
  };
  
  const handlePreview = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p>Chargement des bulletins de paie...</p>
      </div>
    );
  }

  if (payslips.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Aucun bulletin de paie trouvé
      </div>
    );
  }

  return (
    <>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Matricule</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Période</TableHead>
            <TableHead className="text-right">Salaire brut</TableHead>
            <TableHead className="text-right">Net à payer</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payslips.map((payslip) => (
            <TableRow key={payslip.id}>
              <TableCell>{payslip.matricule}</TableCell>
              <TableCell className="font-medium">{payslip.nom}</TableCell>
              <TableCell>{payslip.periode_paie}</TableCell>
              <TableCell className="text-right">{payslip.total_brut.toLocaleString('fr-FR')} FCFA</TableCell>
              <TableCell className="text-right">{payslip.net_a_payer.toLocaleString('fr-FR')} FCFA</TableCell>
              <TableCell>
                <PaymentStatusBadge status={payslip.statut_paiement} />
              </TableCell>
              <TableCell>
                {payslip.date_paiement ? new Date(payslip.date_paiement).toLocaleDateString('fr-FR') : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handlePreview(payslip)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownload(payslip)}
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleOpenUpdateDialog(payslip)}
                        disabled={isUpdating}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Changer le statut
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleOpenDeleteDialog(payslip)}
                        disabled={isDeleting}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le statut du bulletin</DialogTitle>
            <DialogDescription>
              Mettez à jour le statut du bulletin de paie pour {selectedPayslip?.nom}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select 
                value={selectedStatus} 
                onValueChange={(value) => setSelectedStatus(value as PayslipStatus)}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Validé">Validé</SelectItem>
                  <SelectItem value="Payé">Payé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedStatus === "Payé" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMethod" className="text-right">
                    Mode de paiement
                  </Label>
                  <Select 
                    value={selectedPaymentMethod} 
                    onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}
                  >
                    <SelectTrigger id="paymentMethod" className="col-span-3">
                      <SelectValue placeholder="Sélectionner le mode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Virement">Virement bancaire</SelectItem>
                      <SelectItem value="Espèces">Espèces</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentDate" className="text-right">
                    Date de paiement
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="col-span-3 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le bulletin de paie de {selectedPayslip?.nom}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Payslip Preview Dialog */}
      <PayslipPreview 
        payslip={selectedPayslip} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </>
  );
}
