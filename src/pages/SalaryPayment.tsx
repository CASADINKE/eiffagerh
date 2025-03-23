
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Printer, FileDown, Eye } from "lucide-react";
import { toast } from "sonner";
import { useEmployees } from "@/hooks/useEmployees";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PayslipData {
  id: string;
  employeeName: string;
  matricule: string;
  position: string;
  status: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  taxAmount: number;
  generated: boolean;
}

const SalaryPayment = () => {
  const { data: employees, isLoading } = useEmployees();
  const [generatingPayslips, setGeneratingPayslips] = useState(false);
  const [payslips, setPayslips] = useState<PayslipData[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const currentDate = new Date();
  const currentMonth = format(currentDate, 'MMMM yyyy', { locale: fr });
  
  const generatePayslips = () => {
    setGeneratingPayslips(true);
    
    // Simulation de génération des bulletins
    setTimeout(() => {
      if (employees) {
        const generatedPayslips = employees.map(employee => {
          // Génération de données de salaire aléatoires mais réalistes
          const baseSalary = Math.floor(Math.random() * 300000) + 150000; // Entre 150000 et 450000 FCFA
          const allowances = Math.floor(baseSalary * 0.2);
          const deductions = Math.floor(baseSalary * 0.1);
          const taxAmount = Math.floor(baseSalary * 0.15);
          const netSalary = baseSalary + allowances - deductions - taxAmount;
          
          return {
            id: employee.id,
            employeeName: employee.name,
            matricule: employee.email, // Utilisation de l'email comme matricule
            position: employee.position,
            status: employee.status,
            baseSalary,
            allowances,
            deductions,
            taxAmount,
            netSalary,
            generated: true
          };
        });
        
        setPayslips(generatedPayslips);
        toast.success(`${generatedPayslips.length} bulletins de paie générés avec succès`);
      }
      
      setGeneratingPayslips(false);
    }, 2000);
  };
  
  const showPayslipPreview = (payslip: PayslipData) => {
    setSelectedPayslip(payslip);
    setShowPreview(true);
  };
  
  const closePreview = () => {
    setShowPreview(false);
    setSelectedPayslip(null);
  };
  
  const printPayslip = () => {
    // Simulation d'impression
    toast.success("Bulletin de paie envoyé à l'imprimante");
    setTimeout(() => {
      closePreview();
    }, 1500);
  };
  
  const downloadPayslip = () => {
    // Simulation de téléchargement
    toast.success("Bulletin de paie téléchargé");
    setTimeout(() => {
      closePreview();
    }, 1500);
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Paiement des Salaires</h1>
          <p className="text-muted-foreground">Générez et gérez les bulletins de paie des employés</p>
        </div>
        <Button 
          onClick={generatePayslips} 
          disabled={generatingPayslips || isLoading}
          className="mt-4 md:mt-0"
        >
          {generatingPayslips ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            "Générer les bulletins de paie"
          )}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Résumé de la paie - {currentMonth}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-600 font-medium">Employés</p>
                  <p className="text-2xl font-bold">{employees?.length || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-green-600 font-medium">Bulletins générés</p>
                  <p className="text-2xl font-bold">{payslips.length}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <p className="text-amber-600 font-medium">Montant total</p>
                  <p className="text-2xl font-bold">
                    {payslips.reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Bulletins de paie</CardTitle>
            </CardHeader>
            <CardContent>
              {payslips.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Matricule</th>
                        <th className="px-4 py-3 text-left font-medium">Nom</th>
                        <th className="px-4 py-3 text-left font-medium">Poste</th>
                        <th className="px-4 py-3 text-right font-medium">Salaire brut</th>
                        <th className="px-4 py-3 text-right font-medium">Cotisations</th>
                        <th className="px-4 py-3 text-right font-medium">Salaire net</th>
                        <th className="px-4 py-3 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payslips.map((payslip) => (
                        <tr key={payslip.id} className="border-b hover:bg-muted/30">
                          <td className="px-4 py-3">{payslip.matricule}</td>
                          <td className="px-4 py-3 font-medium">{payslip.employeeName}</td>
                          <td className="px-4 py-3">{payslip.position}</td>
                          <td className="px-4 py-3 text-right">{payslip.baseSalary.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3 text-right text-red-500">
                            -{(payslip.deductions + payslip.taxAmount).toLocaleString()} FCFA
                          </td>
                          <td className="px-4 py-3 text-right font-medium">{payslip.netSalary.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => showPayslipPreview(payslip)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  toast.success(`Bulletin de ${payslip.employeeName} téléchargé`);
                                }}
                              >
                                <FileDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">
                    Aucun bulletin de paie généré. Cliquez sur "Générer les bulletins de paie" pour commencer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {showPreview && selectedPayslip && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                  <h2 className="text-xl font-semibold">Bulletin de paie</h2>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={printPayslip}>
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimer
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadPayslip}>
                      <FileDown className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button size="sm" variant="outline" onClick={closePreview}>
                      Fermer
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-y-auto p-6">
                  <div className="border rounded-md overflow-hidden">
                    {/* En-tête du bulletin */}
                    <div className="text-center font-bold text-lg py-2 border-b bg-muted/20">
                      BULLETIN DE PAIE
                    </div>
                    
                    <div className="flex border-b">
                      {/* Partie gauche - Information employeur */}
                      <div className="w-1/2 p-4 border-r">
                        <div className="font-bold">Employeur</div>
                        <div className="flex items-center mt-2">
                          <img 
                            src="/lovable-uploads/5bf70fa7-08a9-4818-b349-27239b6e83cf.png" 
                            alt="EIFFAGE" 
                            className="h-8 mr-2"
                          />
                          <div>
                            <div className="font-bold">EIFFAGE</div>
                            <div>ÉNERGIE</div>
                            <div className="text-sm">T&D Sénégal</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          AV FÉLIX EBOUÉ 5 KM DES BRAS<br />
                          BP<br />
                          DAKAR SÉNÉGAL
                        </div>
                      </div>
                      
                      {/* Partie droite - Information paie */}
                      <div className="w-1/2 p-4">
                        <div className="text-right">
                          <div>Période de paie: {format(currentDate, 'MMMM yyyy', { locale: fr })}</div>
                          <div className="mt-2">
                            <div>Matricule: {selectedPayslip.matricule || "00115"}</div>
                            <div>{selectedPayslip.employeeName || "SEIDI SOULEIMANE"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Corps du bulletin */}
                    <div className="px-4 py-2 border-b bg-muted/20 font-semibold">
                      Convention Collective Nationale
                    </div>
                    
                    <div className="border-b">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/10 text-sm">
                            <th className="border-r px-2 py-1 text-left">Rubrique</th>
                            <th className="border-r px-2 py-1 text-center">Statut</th>
                            <th className="border-r px-2 py-1 text-center">Parts IR</th>
                            <th className="border-r px-2 py-1 text-center">Qualification</th>
                            <th className="px-2 py-1 text-center">Date Naissance</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-sm">
                            <td className="border-r px-2 py-1">10/10/23</td>
                            <td className="border-r px-2 py-1 text-center">E.R</td>
                            <td className="border-r px-2 py-1 text-center">1</td>
                            <td className="border-r px-2 py-1 text-center">CONDUCTEUR ENGINS</td>
                            <td className="px-2 py-1 text-center">10/10/1988</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Détails des rubriques */}
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/10 text-sm">
                          <th className="border-r px-2 py-1 text-left">Libellé</th>
                          <th className="border-r px-2 py-1 text-center">Nombre ou Base</th>
                          <th className="border-r px-2 py-1 text-center">Taux</th>
                          <th className="border-r px-2 py-1 text-center">Retenue Salariale</th>
                          <th className="border-r px-2 py-1 text-center">Gain</th>
                          <th className="border-r px-2 py-1 text-center">Taux Employeur</th>
                          <th className="px-2 py-1 text-center">Montant Employeur</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-sm">
                          <td className="border-r px-2 py-1">101 Salaire de base du mois</td>
                          <td className="border-r px-2 py-1 text-right">{selectedPayslip.baseSalary.toLocaleString()}</td>
                          <td className="border-r px-2 py-1 text-center">1.00</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-right">{selectedPayslip.baseSalary.toLocaleString()}</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="px-2 py-1"></td>
                        </tr>
                        <tr className="text-sm">
                          <td className="border-r px-2 py-1">105 IPRES</td>
                          <td className="border-r px-2 py-1 text-right">{selectedPayslip.baseSalary.toLocaleString()}</td>
                          <td className="border-r px-2 py-1 text-center">0.0580</td>
                          <td className="border-r px-2 py-1 text-right">{Math.floor(selectedPayslip.baseSalary * 0.058).toLocaleString()}</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-center">0.0870</td>
                          <td className="px-2 py-1 text-right">{Math.floor(selectedPayslip.baseSalary * 0.087).toLocaleString()}</td>
                        </tr>
                        <tr className="text-sm">
                          <td className="border-r px-2 py-1">317 Indemnité de déplacement</td>
                          <td className="border-r px-2 py-1 text-right">{Math.floor(selectedPayslip.allowances * 0.7).toLocaleString()}</td>
                          <td className="border-r px-2 py-1 text-center">1.000</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-right">{Math.floor(selectedPayslip.allowances * 0.7).toLocaleString()}</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="px-2 py-1"></td>
                        </tr>
                        <tr className="text-sm">
                          <td className="border-r px-2 py-1">420 Prime de transport</td>
                          <td className="border-r px-2 py-1 text-right">26 000</td>
                          <td className="border-r px-2 py-1 text-center">1.000</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-right">26 000</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="px-2 py-1"></td>
                        </tr>
                        <tr className="text-sm">
                          <td className="border-r px-2 py-1">401 Impôt général</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-right">{selectedPayslip.taxAmount.toLocaleString()}</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="px-2 py-1"></td>
                        </tr>
                        <tr className="text-sm">
                          <td className="border-r px-2 py-1">410 TRIMF</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-right">3 000</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="px-2 py-1"></td>
                        </tr>
                        <tr className="text-sm">
                          <td className="border-r px-2 py-1">6673 Acompte sur prêt</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-right">{Math.floor(selectedPayslip.deductions - 3000).toLocaleString()}</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="px-2 py-1"></td>
                        </tr>
                        <tr className="text-sm">
                          <td className="border-r px-2 py-1">6680 Crédit du mois</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-right">0</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="px-2 py-1"></td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/10 text-sm font-bold">
                          <td className="border-r px-2 py-1 text-right" colSpan={2}>TOTAUX</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="border-r px-2 py-1 text-right">{(selectedPayslip.deductions + selectedPayslip.taxAmount).toLocaleString()}</td>
                          <td className="border-r px-2 py-1 text-right">{(selectedPayslip.baseSalary + selectedPayslip.allowances).toLocaleString()}</td>
                          <td className="border-r px-2 py-1"></td>
                          <td className="px-2 py-1 text-right">{Math.floor(selectedPayslip.baseSalary * 0.087).toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                    
                    {/* Résumé */}
                    <div className="border-t">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/10 text-sm">
                            <th className="border-r px-2 py-1 text-center" colSpan={2}>Brut Social</th>
                            <th className="border-r px-2 py-1 text-center" colSpan={2}>Base IR</th>
                            <th className="border-r px-2 py-1 text-center">IPRES Gén.</th>
                            <th className="border-r px-2 py-1 text-center">IPRES Cad.</th>
                            <th className="border-r px-2 py-1 text-center">IR</th>
                            <th className="border-r px-2 py-1 text-center">TRIMF</th>
                            <th className="px-2 py-1 text-center">NET A PAYER<br />EN FRANCS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-sm">
                            <td className="border-r px-2 py-1 text-center" colSpan={2}>{(selectedPayslip.baseSalary).toLocaleString()}</td>
                            <td className="border-r px-2 py-1 text-center" colSpan={2}>{(selectedPayslip.baseSalary - Math.floor(selectedPayslip.baseSalary * 0.058)).toLocaleString()}</td>
                            <td className="border-r px-2 py-1 text-center">{Math.floor(selectedPayslip.baseSalary * 0.058).toLocaleString()}</td>
                            <td className="border-r px-2 py-1 text-center"></td>
                            <td className="border-r px-2 py-1 text-center">{(selectedPayslip.taxAmount - 3000).toLocaleString()}</td>
                            <td className="border-r px-2 py-1 text-center">3 000</td>
                            <td className="px-2 py-1 text-center font-bold">{selectedPayslip.netSalary.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pied de page */}
                    <div className="border-t p-3 text-sm grid grid-cols-2 gap-4">
                      <div>
                        <div>CONGES PAYES: {Math.floor(selectedPayslip.baseSalary / 12).toLocaleString()}</div>
                        <div>Règlement: espèces</div>
                        <div>Montant: {selectedPayslip.netSalary.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div>PRIX DIV ENTREPRISE</div>
                        <div>Mois: {Math.floor(selectedPayslip.netSalary * 0.02).toLocaleString()}</div>
                        <div>Cumul: {Math.floor(selectedPayslip.netSalary * 0.06).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalaryPayment;
