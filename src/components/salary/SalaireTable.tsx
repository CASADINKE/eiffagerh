
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Salaire, 
  SalairePaiementStatus,
  ModePaiement 
} from "@/services/salaireService";
import { CalendarIcon, CheckCircle2, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PayslipGenerator } from "./PayslipGenerator";

interface SalaireTableProps {
  salaires: Salaire[];
  isLoading: boolean;
  onUpdateStatus: (
    salaireId: string, 
    status: SalairePaiementStatus, 
    modePaiement?: ModePaiement,
    datePaiement?: string
  ) => void;
  isUpdating: boolean;
  statusFilter?: SalairePaiementStatus;
  showActions?: boolean;
}

export function SalaireTable({
  salaires,
  isLoading,
  onUpdateStatus,
  isUpdating,
  statusFilter,
  showActions = true
}: SalaireTableProps) {
  const [selectedSalaire, setSelectedSalaire] = useState<Salaire | null>(null);
  const [modePaiement, setModePaiement] = useState<ModePaiement | "none">("none");
  const [datePaiement, setDatePaiement] = useState<Date | undefined>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [showPayslip, setShowPayslip] = useState<boolean>(false);
  const [selectedPayslipSalaire, setSelectedPayslipSalaire] = useState<Salaire | null>(null);
  
  const handleValidate = (salaire: Salaire) => {
    onUpdateStatus(salaire.id, 'Validé');
  };
  
  const handleOpenPayment = (salaire: Salaire) => {
    setSelectedSalaire(salaire);
    setModePaiement("none");
    setDatePaiement(undefined);
    setOpenDialog(true);
  };
  
  const handlePay = () => {
    if (selectedSalaire && modePaiement !== "none") {
      onUpdateStatus(
        selectedSalaire.id, 
        'Payé', 
        modePaiement as ModePaiement,
        datePaiement ? format(datePaiement, 'yyyy-MM-dd') : undefined
      );
      setOpenDialog(false);
    }
  };

  const handleGeneratePayslip = (salaire: Salaire) => {
    setSelectedPayslipSalaire(salaire);
    setShowPayslip(true);
  };
  
  const filteredSalaires = statusFilter 
    ? salaires.filter(s => s.statut_paiement === statusFilter)
    : salaires;
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement des données...</div>;
  }
  
  if (filteredSalaires.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun salaire trouvé
      </div>
    );
  }
  
  const getStatusBadge = (status: SalairePaiementStatus) => {
    switch (status) {
      case 'En attente':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">En attente</span>;
      case 'Validé':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Validé</span>;
      case 'Payé':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">Payé</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Matricule</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Période</TableHead>
            <TableHead className="text-right">Salaire brut</TableHead>
            <TableHead className="text-right">Net à payer</TableHead>
            <TableHead>Statut</TableHead>
            {salaires.some(s => s.statut_paiement === 'Payé') && (
              <>
                <TableHead>Mode de paiement</TableHead>
                <TableHead>Date de paiement</TableHead>
              </>
            )}
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSalaires.map((salaire) => {
            const salaireBrut = 
              salaire.salaire_base + 
              salaire.sursalaire + 
              salaire.indemnite_deplacement + 
              salaire.prime_transport;
            
            return (
              <TableRow key={salaire.id}>
                <TableCell>{salaire.matricule}</TableCell>
                <TableCell>{salaire.nom}</TableCell>
                <TableCell>{salaire.periode_paie}</TableCell>
                <TableCell className="text-right">{salaireBrut.toLocaleString('fr-FR')} FCFA</TableCell>
                <TableCell className="text-right">{salaire.net_a_payer.toLocaleString('fr-FR')} FCFA</TableCell>
                <TableCell>{getStatusBadge(salaire.statut_paiement)}</TableCell>
                {salaires.some(s => s.statut_paiement === 'Payé') && (
                  <>
                    <TableCell>{salaire.mode_paiement || "-"}</TableCell>
                    <TableCell>
                      {salaire.date_paiement ? format(new Date(salaire.date_paiement), 'dd/MM/yyyy') : "-"}
                    </TableCell>
                  </>
                )}
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleGeneratePayslip(salaire)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Bulletin
                      </Button>
                      
                      {salaire.statut_paiement === 'En attente' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleValidate(salaire)}
                          disabled={isUpdating}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Valider
                        </Button>
                      )}
                      {salaire.statut_paiement === 'Validé' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenPayment(salaire)}
                          disabled={isUpdating}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Payer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procéder au paiement</DialogTitle>
            <DialogDescription>
              Choisissez le mode de paiement et la date pour valider le paiement du salaire.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="mode-paiement">Mode de paiement</Label>
              <Select
                value={modePaiement}
                onValueChange={(value) => setModePaiement(value as ModePaiement)}
              >
                <SelectTrigger id="mode-paiement">
                  <SelectValue placeholder="Sélectionnez un mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sélectionner un mode</SelectItem>
                  <SelectItem value="Virement">Virement</SelectItem>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date-paiement">Date de paiement</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-paiement"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !datePaiement && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {datePaiement ? (
                      format(datePaiement, 'PPP', { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={datePaiement}
                    onSelect={setDatePaiement}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button 
              onClick={handlePay} 
              disabled={modePaiement === "none" || isUpdating}
            >
              {isUpdating ? "Traitement..." : "Confirmer le paiement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPayslip} onOpenChange={setShowPayslip} className="w-full max-w-4xl">
        <DialogContent className="max-w-4xl w-full max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulletin de Paie</DialogTitle>
            <DialogDescription>
              Bulletin de paie pour {selectedPayslipSalaire?.nom} - {selectedPayslipSalaire?.periode_paie}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayslipSalaire && (
            <PayslipGenerator 
              salaire={selectedPayslipSalaire} 
              onClose={() => setShowPayslip(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
