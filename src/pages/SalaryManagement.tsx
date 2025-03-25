
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PayslipsTable } from "@/components/salary/PayslipsTable";
import { usePayslips } from "@/hooks/usePayslips";
import { Payslip, PayslipStatus, PaymentMethod } from "@/services/payslipService";
import { Search, FileCheck, FileClock, Download } from "lucide-react";

const SalaryManagement = () => {
  const { payslips, isLoading, updateStatus, isUpdating } = usePayslips();
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  
  const getFilteredPayslips = () => {
    if (!payslips) return [];
    
    let filtered = [...payslips];
    
    // Filter by tab
    if (currentTab === "pending") {
      filtered = filtered.filter(p => p.statut_paiement === "En attente");
    } else if (currentTab === "validated") {
      filtered = filtered.filter(p => p.statut_paiement === "Validé");
    } else if (currentTab === "paid") {
      filtered = filtered.filter(p => p.statut_paiement === "Payé");
    }
    
    // Filter by status dropdown
    if (filterStatus) {
      filtered = filtered.filter(p => p.statut_paiement === filterStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p => 
          p.matricule.toLowerCase().includes(term) || 
          p.nom.toLowerCase().includes(term) ||
          p.periode_paie.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  const filteredPayslips = getFilteredPayslips();
  
  // Calculate stats for summary cards
  const getTotalsByStatus = () => {
    if (!payslips) return { pending: 0, validated: 0, paid: 0, total: 0 };
    
    return payslips.reduce((acc, curr) => {
      acc.total += curr.net_a_payer;
      
      if (curr.statut_paiement === 'En attente') {
        acc.pending += curr.net_a_payer;
      } else if (curr.statut_paiement === 'Validé') {
        acc.validated += curr.net_a_payer;
      } else if (curr.statut_paiement === 'Payé') {
        acc.paid += curr.net_a_payer;
      }
      
      return acc;
    }, { pending: 0, validated: 0, paid: 0, total: 0 });
  };
  
  const totals = getTotalsByStatus();
  
  const handleUpdateStatus = (
    payslipId: string, 
    status: PayslipStatus, 
    paymentMethod?: string, 
    paymentDate?: string
  ) => {
    updateStatus({ 
      payslipId, 
      status, 
      paymentMethod: paymentMethod as PaymentMethod, 
      paymentDate 
    });
  };
  
  // Get counts for tabs
  const getPayslipCounts = () => {
    if (!payslips) return { pending: 0, validated: 0, paid: 0, all: 0 };
    
    return payslips.reduce((acc, curr) => {
      acc.all++;
      
      if (curr.statut_paiement === 'En attente') {
        acc.pending++;
      } else if (curr.statut_paiement === 'Validé') {
        acc.validated++;
      } else if (curr.statut_paiement === 'Payé') {
        acc.paid++;
      }
      
      return acc;
    }, { pending: 0, validated: 0, paid: 0, all: 0 });
  };
  
  const counts = getPayslipCounts();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Gestion des Paies</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total des salaires</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.total.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">
              {counts.all} bulletin{counts.all > 1 ? 's' : ''} au total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.pending.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">
              {counts.pending} bulletin{counts.pending > 1 ? 's' : ''} en attente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.validated.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">
              {counts.validated} bulletin{counts.validated > 1 ? 's' : ''} validé{counts.validated > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payés</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.paid.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">
              {counts.paid} bulletin{counts.paid > 1 ? 's' : ''} payé{counts.paid > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Bulletins de paie</CardTitle>
            <CardDescription>
              Gérez les bulletins de paie et leur statut de paiement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="all" 
              className="w-full"
              onValueChange={(value) => setCurrentTab(value)}
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">
                    Tous ({counts.all})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    En attente ({counts.pending})
                  </TabsTrigger>
                  <TabsTrigger value="validated">
                    Validés ({counts.validated})
                  </TabsTrigger>
                  <TabsTrigger value="paid">
                    Payés ({counts.paid})
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="w-[160px]">
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les statuts</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Validé">Validé</SelectItem>
                        <SelectItem value="Payé">Payé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <PayslipsTable
                  payslips={filteredPayslips}
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <PayslipsTable
                  payslips={filteredPayslips}
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              
              <TabsContent value="validated" className="mt-0">
                <PayslipsTable
                  payslips={filteredPayslips}
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              
              <TabsContent value="paid" className="mt-0">
                <PayslipsTable
                  payslips={filteredPayslips}
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalaryManagement;
