
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayslips } from "@/hooks/usePayslips";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatusBadge } from "@/components/salary/PaymentStatusBadge";
import { Download, FileSpreadsheet, Users, CalendarRange, Search } from "lucide-react";

export default function PayrollManagement() {
  const { payslips, isLoading } = usePayslips();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  
  // Filtrage des bulletins de paie
  const filteredPayslips = (payslips || []).filter(payslip => {
    const matchesSearch = payslip.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payslip.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.periode_paie.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = selectedMonth ? payslip.periode_paie.includes(selectedMonth) : true;
    
    return matchesSearch && matchesMonth;
  });
  
  // Calcul des statistiques
  const totalPaid = filteredPayslips
    .filter(p => p.statut_paiement === "Payé")
    .reduce((sum, p) => sum + p.net_a_payer, 0);
    
  const totalPending = filteredPayslips
    .filter(p => p.statut_paiement === "En attente")
    .reduce((sum, p) => sum + p.net_a_payer, 0);
    
  const employeeCount = [...new Set(filteredPayslips.map(p => p.matricule))].length;
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Historique des Paies</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Payé</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaid.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">Bulletins payés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">Bulletins en attente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Employés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount}</div>
            <p className="text-xs text-muted-foreground">Employés concernés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Périodes</CardTitle>
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{[...new Set(filteredPayslips.map(p => p.periode_paie))].length}</div>
            <p className="text-xs text-muted-foreground">Périodes de paie</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historique des bulletins de paie</CardTitle>
          <CardDescription>Historique complet des paiements salariaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par nom, matricule..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 md:flex-initial md:w-48">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les périodes</SelectItem>
                  {months.map((month) => (
                    years.map((year) => (
                      <SelectItem key={`${month}-${year}`} value={`${month} ${year}`}>
                        {month} {year}
                      </SelectItem>
                    ))
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-initial">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exporter
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p>Chargement des données...</p>
            </div>
          ) : filteredPayslips.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Aucun bulletin de paie trouvé
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Salaire brut</TableHead>
                  <TableHead>Net à payer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Mode de paiement</TableHead>
                  <TableHead>Date de paiement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell>{payslip.matricule}</TableCell>
                    <TableCell>{payslip.nom}</TableCell>
                    <TableCell>{payslip.periode_paie}</TableCell>
                    <TableCell>{payslip.total_brut.toLocaleString('fr-FR')} FCFA</TableCell>
                    <TableCell>{payslip.net_a_payer.toLocaleString('fr-FR')} FCFA</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payslip.statut_paiement} />
                    </TableCell>
                    <TableCell>{payslip.mode_paiement || "Non défini"}</TableCell>
                    <TableCell>{payslip.date_paiement ? new Date(payslip.date_paiement).toLocaleDateString('fr-FR') : "Non payé"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
