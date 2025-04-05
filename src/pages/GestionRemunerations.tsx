
import { useState } from "react";
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

export default function GestionRemunerations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("salaires");
  
  // Dummy data for the example
  const salaires = [
    { id: "1", nom: "Salaire de base - Catégorie A", montant: 350000, description: "Salaire mensuel pour les employés de catégorie A" },
    { id: "2", nom: "Salaire de base - Catégorie B", montant: 250000, description: "Salaire mensuel pour les employés de catégorie B" },
    { id: "3", nom: "Salaire de base - Catégorie C", montant: 180000, description: "Salaire mensuel pour les employés de catégorie C" },
  ];
  
  const sursalaires = [
    { id: "1", nom: "Prime d'ancienneté", montant: 50000, description: "Prime accordée après 5 ans d'ancienneté" },
    { id: "2", nom: "Prime de performance", montant: 75000, description: "Prime trimestrielle basée sur les objectifs atteints" },
    { id: "3", nom: "Indemnité de déplacement", montant: 30000, description: "Compensation mensuelle pour les déplacements professionnels" },
  ];
  
  const filteredSalaires = salaires.filter(item => 
    item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSursalaires = sursalaires.filter(item => 
    item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Rémunérations</h1>
        <Button>
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
          <Tabs defaultValue="salaires" onValueChange={setActiveTab}>
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
              </div>
            </div>
            
            <TabsContent value="salaires" className="mt-0">
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
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="sursalaires" className="mt-0">
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
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tendance des salaires</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2.5%</div>
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
            <div className="text-2xl font-bold">25,430,000 FCFA</div>
            <p className="text-xs text-muted-foreground">
              Total des salaires et primes pour le mois en cours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
