
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useEmployeePayslips } from "@/hooks/useEmployeePayslips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { BulletinPaie, getBulletinPaieById } from "@/services/payslipService";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { generatePayslipPDF } from "@/components/salary/PayslipList";

const EmployeePayslips = () => {
  const [searchParams] = useSearchParams();
  const matricule = searchParams.get("matricule");
  const [selectedPayslip, setSelectedPayslip] = useState<BulletinPaie | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const { data: payslips, isLoading, error } = useEmployeePayslips(matricule);
  
  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des bulletins de paie");
    }
  }, [error]);
  
  const handleViewPayslip = async (id: string) => {
    try {
      const payslip = await getBulletinPaieById(id);
      if (payslip) {
        setSelectedPayslip(payslip);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du bulletin:", error);
      toast.error("Impossible de visualiser le bulletin de paie");
    }
  };
  
  const handleDownloadPayslip = async (id: string) => {
    try {
      const payslip = await getBulletinPaieById(id);
      if (payslip) {
        generatePayslipPDF(payslip);
        toast.success("Bulletin de paie téléchargé");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement du bulletin:", error);
      toast.error("Impossible de télécharger le bulletin de paie");
    }
  };
  
  const closePreview = () => {
    setShowPreview(false);
    setSelectedPayslip(null);
  };
  
  if (!matricule) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Aucun matricule spécifié. Veuillez accéder à cette page depuis votre profil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Mes Bulletins de Paie - Matricule: {matricule}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Chargement des bulletins de paie...
            </div>
          ) : payslips && payslips.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-right">Salaire de base</TableHead>
                    <TableHead className="text-right">Indemnités</TableHead>
                    <TableHead className="text-right">Retenues</TableHead>
                    <TableHead className="text-right">Net à payer</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell className="font-medium">{payslip.periode_paie}</TableCell>
                      <TableCell className="text-right">{payslip.salaire_base.toLocaleString()} FCFA</TableCell>
                      <TableCell className="text-right">
                        {(payslip.prime_transport + payslip.indemnite_deplacement).toLocaleString()} FCFA
                      </TableCell>
                      <TableCell className="text-right">
                        {(payslip.retenue_ir + payslip.ipres_general + payslip.trimf).toLocaleString()} FCFA
                      </TableCell>
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
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Aucun bulletin de paie trouvé pour ce matricule
            </div>
          )}
        </CardContent>
      </Card>
      
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
              
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => handleDownloadPayslip(selectedPayslip.id)}
                  className="ml-2"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmployeePayslips;
