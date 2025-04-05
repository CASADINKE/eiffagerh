
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRemunerationsOperations } from "@/hooks/useRemunerationsOperations";
import { RemunerationForm } from "@/components/salary/RemunerationForm";
import { ConfirmDeleteDialog } from "@/components/salary/ConfirmDeleteDialog";

export interface Remuneration {
  id: string;
  nom: string;
  montant: number;
  description: string;
  type: 'salaire' | 'sursalaire';
  categorie?: string;
}

export default function GestionRemunerations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("salaires");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRemuneration, setSelectedRemuneration] = useState<Remuneration | null>(null);
  
  const { 
    salaires, 
    sursalaires, 
    isLoading, 
    addRemuneration,
    updateRemuneration,
    deleteRemuneration,
    stats
  } = useRemunerationsOperations();
  
  const handleAdd = () => {
    setSelectedRemuneration(null);
    setIsAddDialogOpen(true);
  };
  
  const handleEdit = (item: Remuneration) => {
    setSelectedRemuneration(item);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (item: Remuneration) => {
    setSelectedRemuneration(item);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (selectedRemuneration) {
      try {
        await deleteRemuneration(selectedRemuneration.id);
        toast.success("Élément supprimé avec succès");
      } catch (error) {
        toast.error("Erreur lors de la suppression");
        console.error(error);
      }
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleSaveRemuneration = async (data: Omit<Remuneration, 'id'>) => {
    try {
      await addRemuneration(data);
      toast.success("Élément ajouté avec succès");
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
      console.error(error);
    }
  };
  
  const handleUpdateRemuneration = async (data: Remuneration) => {
    try {
      await updateRemuneration(data);
      toast.success("Élément mis à jour avec succès");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };
  
  const filteredSalaires = salaires
    .filter(item => 
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => filterCategory === 'all' || 
      item.categorie?.toLowerCase() === filterCategory.toLowerCase());
  
  const filteredSursalaires = sursalaires
    .filter(item => 
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Rémunérations</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle rémunération
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grilles de salaires et primes</CardTitle>
          <CardDescription>
            Configurez les grilles de salaires de base et les primes additionnelles pour votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="salaires">
                  Salaires de base
                </TabsTrigger>
                <TabsTrigger value="sursalaires">
                  Primes et indemnités
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-[250px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {activeTab === "salaires" && (
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="a">Catégorie A</SelectItem>
                      <SelectItem value="b">Catégorie B</SelectItem>
                      <SelectItem value="c">Catégorie C</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <TabsContent value="salaires" className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : filteredSalaires.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun salaire trouvé
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Montant (FCFA)</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalaires.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.montant.toLocaleString('fr-FR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="sursalaires" className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : filteredSursalaires.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune prime trouvée
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Montant (FCFA)</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSursalaires.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.montant.toLocaleString('fr-FR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tendance des salaires</CardTitle>
            {stats?.salaryTrend && stats.salaryTrend > 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.salaryTrend ? `${stats.salaryTrend.toFixed(1)}%` : '+0.0%'}</div>
            <p className="text-xs text-muted-foreground">
              Progression salariale moyenne par rapport au dernier trimestre
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Masse salariale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSalaryMass ? stats.totalSalaryMass.toLocaleString('fr-FR') : '0'} FCFA</div>
            <p className="text-xs text-muted-foreground">
              Total des salaires et primes pour le mois en cours
            </p>
          </CardContent>
        </Card>
      </div>
      
      <RemunerationForm 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleSaveRemuneration}
        type={activeTab === "salaires" ? "salaire" : "sursalaire"}
      />
      
      {selectedRemuneration && (
        <RemunerationForm 
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={(data) => handleUpdateRemuneration({...data, id: selectedRemuneration.id})}
          type={selectedRemuneration.type}
          initialData={selectedRemuneration}
        />
      )}
      
      <ConfirmDeleteDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
      />
    </div>
  );
}
