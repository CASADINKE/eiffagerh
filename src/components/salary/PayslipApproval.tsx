
import { useState } from "react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  AlertCircle 
} from "lucide-react";
import { BulletinPaie, updateBulletinPaie } from "@/services/payslipService";

interface PayslipApprovalProps {
  payslips: BulletinPaie[];
  onRefresh: () => void;
}

export function PayslipApproval({ payslips, onRefresh }: PayslipApprovalProps) {
  const [selectedPayslip, setSelectedPayslip] = useState<BulletinPaie | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleApprovePayslip = async () => {
    if (!selectedPayslip) return;
    
    setIsProcessing(true);
    try {
      const success = await updateBulletinPaie(selectedPayslip.id, {
        status: 'approved'
      });
      
      if (success) {
        toast.success("Bulletin de paie approuvé avec succès");
        onRefresh();
      } else {
        toast.error("Erreur lors de l'approbation du bulletin de paie");
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      toast.error("Erreur lors de l'approbation du bulletin de paie");
    } finally {
      setIsProcessing(false);
      setShowApprovalDialog(false);
      setSelectedPayslip(null);
    }
  };
  
  const handleRejectPayslip = async () => {
    if (!selectedPayslip) return;
    
    setIsProcessing(true);
    try {
      const success = await updateBulletinPaie(selectedPayslip.id, {
        status: 'rejected'
      });
      
      if (success) {
        toast.success("Bulletin de paie rejeté");
        onRefresh();
      } else {
        toast.error("Erreur lors du rejet du bulletin de paie");
      }
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      toast.error("Erreur lors du rejet du bulletin de paie");
    } finally {
      setIsProcessing(false);
      setShowRejectionDialog(false);
      setSelectedPayslip(null);
    }
  };
  
  const openApprovalDialog = (payslip: BulletinPaie) => {
    setSelectedPayslip(payslip);
    setShowApprovalDialog(true);
  };
  
  const openRejectionDialog = (payslip: BulletinPaie) => {
    setSelectedPayslip(payslip);
    setShowRejectionDialog(true);
  };
  
  const openPreview = (payslip: BulletinPaie) => {
    setSelectedPayslip(payslip);
    setShowPreview(true);
  };
  
  const closePreview = () => {
    setShowPreview(false);
    setSelectedPayslip(null);
  };
  
  const getStatusBadge = (status: string | undefined) => {
    if (!status || status === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" /> En attente
        </span>
      );
    } else if (status === 'approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Approuvé
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Rejeté
        </span>
      );
    }
    return null;
  };
  
  // Filter to get only pending payslips
  const pendingPayslips = payslips.filter(p => !p.status || p.status === 'pending');
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Validation des Bulletins de Paie</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingPayslips.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Aucun bulletin de paie en attente de validation
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-right">Salaire Base</TableHead>
                    <TableHead className="text-right">Net à Payer</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell className="font-medium">{payslip.matricule}</TableCell>
                      <TableCell>{payslip.nom}</TableCell>
                      <TableCell>{payslip.periode_paie}</TableCell>
                      <TableCell className="text-right">{payslip.salaire_base.toLocaleString()} FCFA</TableCell>
                      <TableCell className="text-right">{payslip.net_a_payer.toLocaleString()} FCFA</TableCell>
                      <TableCell className="text-center">{getStatusBadge(payslip.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => openPreview(payslip)}
                            title="Voir"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50" 
                            onClick={() => openApprovalDialog(payslip)}
                            title="Approuver"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" 
                            onClick={() => openRejectionDialog(payslip)}
                            title="Rejeter"
                          >
                            <XCircle className="h-4 w-4" />
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
      
      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'approbation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir approuver ce bulletin de paie ?
              <div className="mt-2 p-3 bg-gray-100 rounded-md">
                <p><strong>Employé:</strong> {selectedPayslip?.nom}</p>
                <p><strong>Matricule:</strong> {selectedPayslip?.matricule}</p>
                <p><strong>Période:</strong> {selectedPayslip?.periode_paie}</p>
                <p><strong>Montant net:</strong> {selectedPayslip?.net_a_payer.toLocaleString()} FCFA</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowApprovalDialog(false)}
              disabled={isProcessing}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleApprovePayslip}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Traitement en cours..." : "Confirmer l'approbation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le rejet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir rejeter ce bulletin de paie ?
              <div className="mt-2 p-3 bg-gray-100 rounded-md">
                <p><strong>Employé:</strong> {selectedPayslip?.nom}</p>
                <p><strong>Matricule:</strong> {selectedPayslip?.matricule}</p>
                <p><strong>Période:</strong> {selectedPayslip?.periode_paie}</p>
                <p><strong>Montant net:</strong> {selectedPayslip?.net_a_payer.toLocaleString()} FCFA</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectionDialog(false)}
              disabled={isProcessing}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleRejectPayslip}
              disabled={isProcessing}
              variant="destructive"
            >
              {isProcessing ? "Traitement en cours..." : "Confirmer le rejet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payslip Preview */}
      {showPreview && selectedPayslip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bulletin de Paie - {selectedPayslip.periode_paie}</CardTitle>
              <Button variant="ghost" onClick={closePreview}>X</Button>
            </CardHeader>
            <CardContent className="payslip-preview">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-1">BULLETIN DE PAIE</h2>
                <p className="text-sm">EIFFAGE ENERGIE T&D Sénégal</p>
                <p className="text-xs">AV PETIT MBAO X RTE DES BRAS BP 29389 DAKAR SÉNÉGAL</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p><span className="font-semibold">Matricule:</span> {selectedPayslip.matricule}</p>
                  <p><span className="font-semibold">Nom:</span> {selectedPayslip.nom}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Période:</span> {selectedPayslip.periode_paie}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Détails du salaire</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Montant (FCFA)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Salaire de base</TableCell>
                      <TableCell className="text-right">{selectedPayslip.salaire_base.toLocaleString()}</TableCell>
                    </TableRow>
                    {selectedPayslip.sursalaire > 0 && (
                      <TableRow>
                        <TableCell>Sursalaire</TableCell>
                        <TableCell className="text-right">{selectedPayslip.sursalaire.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {selectedPayslip.prime_transport > 0 && (
                      <TableRow>
                        <TableCell>Prime de transport</TableCell>
                        <TableCell className="text-right">{selectedPayslip.prime_transport.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {selectedPayslip.indemnite_deplacement > 0 && (
                      <TableRow>
                        <TableCell>Indemnité de déplacement</TableCell>
                        <TableCell className="text-right">{selectedPayslip.indemnite_deplacement.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    <TableRow className="border-t-2">
                      <TableCell className="font-semibold">Total Brut</TableCell>
                      <TableCell className="text-right font-semibold">{selectedPayslip.total_brut.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Déductions</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Montant (FCFA)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPayslip.retenue_ir > 0 && (
                      <TableRow>
                        <TableCell>Retenue IR</TableCell>
                        <TableCell className="text-right">{selectedPayslip.retenue_ir.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {selectedPayslip.ipres_general > 0 && (
                      <TableRow>
                        <TableCell>IPRES Général</TableCell>
                        <TableCell className="text-right">{selectedPayslip.ipres_general.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {selectedPayslip.trimf > 0 && (
                      <TableRow>
                        <TableCell>TRIMF</TableCell>
                        <TableCell className="text-right">{selectedPayslip.trimf.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    <TableRow className="border-t-2">
                      <TableCell className="font-semibold">Total Déductions</TableCell>
                      <TableCell className="text-right font-semibold">
                        {(selectedPayslip.retenue_ir + selectedPayslip.ipres_general + selectedPayslip.trimf).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-md text-lg flex justify-between font-bold">
                <span>NET À PAYER</span>
                <span>{selectedPayslip.net_a_payer.toLocaleString()} FCFA</span>
              </div>
              
              <div className="mt-6 text-center text-xs text-gray-500 italic">
                <p>Ce document a une valeur informative et ne constitue pas une pièce comptable officielle.</p>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outline" 
                  onClick={closePreview}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => openApprovalDialog(selectedPayslip)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approuver
                </Button>
                <Button
                  onClick={() => openRejectionDialog(selectedPayslip)}
                  variant="destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
