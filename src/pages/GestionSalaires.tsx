import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaireForm } from "@/components/salary/SalaireForm";
import { SalaireTable } from "@/components/salary/SalaireTable";
import { useSalaires } from "@/hooks/useSalaires";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileCheck, FileClock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalairePaiementStatus, ModePaiement } from "@/services/salaireService";
import { toast } from "sonner";

export default function GestionSalaires() {
  const { 
    salaires, 
    isLoading,
    updateStatus, 
    isUpdating,
    deleteSalaire,
    isDeleting
  } = useSalaires();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  
  const filteredSalaires = (salaires || []).filter(s => {
    const matchesSearch = 
      s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.periode_paie.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" ? true : s.statut_paiement === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatsByStatus = () => {
    if (!salaires) return { pending: 0, validated: 0, paid: 0, total: 0 };
    
    return salaires.reduce((acc, curr) => {
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
  
  const stats = getStatsByStatus();
  
  const getCounts = () => {
    if (!salaires) return { pending: 0, validated: 0, paid: 0, all: 0 };
    
    return salaires.reduce((acc, curr) => {
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
  
  const counts = getCounts();
  
  const handleUpdateStatus = (
    salaireId: string, 
    status: SalairePaiementStatus, 
    modePaiement?: ModePaiement, 
    datePaiement?: string
  ) => {
    updateStatus({ salaireId, status, modePaiement, datePaiement });
  };
  
  const handleDeleteSalaire = (salaireId: string) => {
    if (deleteSalaire) {
      deleteSalaire(salaireId);
      toast.success("Salaire en cours de suppression...");
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Salaires</h1>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="mt-4 md:mt-0"
        >
          {showForm ? "Masquer le formulaire" : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouveau salaire
            </>
          )}
        </Button>
      </div>
      
      {showForm && (
        <div className="mb-6">
          <SalaireForm />
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
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
            <div className="text-2xl font-bold">{stats.total.toLocaleString('fr-FR')} FCFA</div>
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
            <div className="text-2xl font-bold">{stats.pending.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">
              {counts.pending} bulletin{counts.pending > 1 ? 's' : ''} en attente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Validés/Payés</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.validated + stats.paid).toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">
              {counts.validated + counts.paid} bulletin{counts.validated + counts.paid > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulletins de salaire</CardTitle>
          <CardDescription>
            Gérez les bulletins de salaire et leur statut de paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            value={currentTab}
            onValueChange={(value) => setCurrentTab(value)}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
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
              
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-8 w-full md:w-[200px]"
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
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Validé">Validé</SelectItem>
                      <SelectItem value="Payé">Payé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <TabsContent value="all">
              <SalaireTable
                salaires={filteredSalaires}
                isLoading={isLoading}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
                onDeleteSalaire={handleDeleteSalaire}
                isDeleting={isDeleting}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <SalaireTable
                salaires={filteredSalaires.filter(s => s.statut_paiement === 'En attente')}
                isLoading={isLoading}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
                statusFilter="En attente"
                onDeleteSalaire={handleDeleteSalaire}
                isDeleting={isDeleting}
              />
            </TabsContent>
            
            <TabsContent value="validated">
              <SalaireTable
                salaires={filteredSalaires.filter(s => s.statut_paiement === 'Validé')}
                isLoading={isLoading}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
                statusFilter="Validé"
                onDeleteSalaire={handleDeleteSalaire}
                isDeleting={isDeleting}
              />
            </TabsContent>
            
            <TabsContent value="paid">
              <SalaireTable
                salaires={filteredSalaires.filter(s => s.statut_paiement === 'Payé')}
                isLoading={isLoading}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
                statusFilter="Payé"
                onDeleteSalaire={handleDeleteSalaire}
                isDeleting={isDeleting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
