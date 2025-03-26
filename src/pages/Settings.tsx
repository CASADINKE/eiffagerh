
import { useState } from "react";
import { Shield, Users, Building, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock roles and permissions data
const roles = [
  {
    id: "1",
    name: "Administrateur",
    description: "Accès complet à tous les paramètres et fonctionnalités",
    usersCount: 2,
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Responsable RH",
    description: "Peut gérer les employés, les congés et la paie",
    usersCount: 5,
    permissions: ["employees", "leaves", "salary"],
  },
  {
    id: "3",
    name: "Employé",
    description: "Accès de base aux informations personnelles et au suivi du temps",
    usersCount: 120,
    permissions: ["profile", "time", "leave-request"],
  },
  {
    id: "4",
    name: "Chef d'équipe",
    description: "Peut gérer les membres de l'équipe et approuver les congés d'équipe",
    usersCount: 10,
    permissions: ["team-view", "leave-approve", "time-approve"],
  },
] as const;

const Settings = () => {
  const [activeTab, setActiveTab] = useState("roles");
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez la configuration de votre système RH</p>
      </div>
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full p-0">
            <TabsTrigger value="roles" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Shield size={16} />
              <span>Rôles & Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Building size={16} />
              <span>Entreprise</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Mail size={16} />
              <span>Intégrations</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles" className="p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Rôles & Permissions</h2>
              <Button>Ajouter un nouveau rôle</Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du rôle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.usersCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">Modifier</Button>
                      {role.name !== "Administrateur" && (
                        <Button variant="outline" size="sm">Supprimer</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Groupes de permissions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Gestion des employés</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-employees" />
                      <label htmlFor="perm-view-employees" className="text-sm">Voir les employés</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-add-employees" />
                      <label htmlFor="perm-add-employees" className="text-sm">Ajouter des employés</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-edit-employees" />
                      <label htmlFor="perm-edit-employees" className="text-sm">Modifier les employés</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-delete-employees" />
                      <label htmlFor="perm-delete-employees" className="text-sm">Supprimer des employés</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Gestion des congés</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-leaves" />
                      <label htmlFor="perm-view-leaves" className="text-sm">Voir les congés</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-approve-leaves" />
                      <label htmlFor="perm-approve-leaves" className="text-sm">Approuver les congés</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-add-leaves" />
                      <label htmlFor="perm-add-leaves" className="text-sm">Ajouter des types de congés</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Paie & Salaire</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-salary" />
                      <label htmlFor="perm-view-salary" className="text-sm">Voir les salaires</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-edit-salary" />
                      <label htmlFor="perm-edit-salary" className="text-sm">Modifier les salaires</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-run-payroll" />
                      <label htmlFor="perm-run-payroll" className="text-sm">Exécuter la paie</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Suivi du temps</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-time" />
                      <label htmlFor="perm-view-time" className="text-sm">Voir les enregistrements de temps</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-edit-time" />
                      <label htmlFor="perm-edit-time" className="text-sm">Modifier les enregistrements de temps</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-approve-time" />
                      <label htmlFor="perm-approve-time" className="text-sm">Approuver les feuilles de temps</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Rapports</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-reports" />
                      <label htmlFor="perm-view-reports" className="text-sm">Voir les rapports</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-export-reports" />
                      <label htmlFor="perm-export-reports" className="text-sm">Exporter les rapports</label>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Paramètres système</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-view-settings" />
                      <label htmlFor="perm-view-settings" className="text-sm">Voir les paramètres</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-edit-settings" />
                      <label htmlFor="perm-edit-settings" className="text-sm">Modifier les paramètres</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perm-manage-roles" />
                      <label htmlFor="perm-manage-roles" className="text-sm">Gérer les rôles</label>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button>Enregistrer les modifications</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="company" className="p-6">
            <h2 className="text-xl font-semibold mb-6">Paramètres de l'entreprise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input id="company-name" defaultValue="HR Zenith Inc." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email de l'entreprise</Label>
                  <Input id="company-email" type="email" defaultValue="admin@hrzenith.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Téléphone de l'entreprise</Label>
                  <Input id="company-phone" type="tel" defaultValue="+1 234 567 890" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-website">Site web de l'entreprise</Label>
                  <Input id="company-website" type="url" defaultValue="https://hrzenith.com" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-address">Adresse de l'entreprise</Label>
                  <Input id="company-address" defaultValue="123 Business Ave." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-city">Ville</Label>
                  <Input id="company-city" defaultValue="San Francisco" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-state">État/Région</Label>
                    <Input id="company-state" defaultValue="California" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-zip">Code postal</Label>
                    <Input id="company-zip" defaultValue="94105" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-country">Pays</Label>
                  <Select defaultValue="usa">
                    <SelectTrigger id="company-country">
                      <SelectValue placeholder="Sélectionner le pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">États-Unis</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="uk">Royaume-Uni</SelectItem>
                      <SelectItem value="australia">Australie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Heures de travail & Jours fériés</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="text-md font-medium mb-3">Heures de travail</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Lundi à Vendredi</span>
                      <div className="flex gap-2">
                        <Select defaultValue="9">
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Début" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i} value={`${i + 8}`}>{i + 8}:00</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="self-center">à</span>
                        <Select defaultValue="17">
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Fin" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i} value={`${i + 13}`}>{i + 13}:00</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Samedi</span>
                      <div className="flex gap-2">
                        <Select defaultValue="closed">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Ouvert</SelectItem>
                            <SelectItem value="closed">Fermé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Dimanche</span>
                      <div className="flex gap-2">
                        <Select defaultValue="closed">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Ouvert</SelectItem>
                            <SelectItem value="closed">Fermé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="p-6">
            <h2 className="text-xl font-semibold mb-6">Paramètres de notifications</h2>
            <p className="text-muted-foreground mb-6">
              Configurez comment et quand vous recevez des notifications.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications par email</h3>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications push</h3>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par push navigateur
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications SMS</h3>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications importantes par SMS
                  </p>
                </div>
                <Switch />
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Catégories de notifications</h3>
              
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-medium">Demandes de congés</h4>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour les demandes et approbations de congés
                      </p>
                    </div>
                    <Switch />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-medium">Paie</h4>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour le traitement des salaires et les paiements
                      </p>
                    </div>
                    <Switch />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-medium">Suivi du temps</h4>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour les pointages et approbations
                      </p>
                    </div>
                    <Switch />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-medium">Mises à jour système</h4>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour les changements et mises à jour du système
                      </p>
                    </div>
                    <Switch />
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations" className="p-6">
            <h2 className="text-xl font-semibold mb-6">Intégrations</h2>
            <p className="text-muted-foreground mb-6">
              Connectez votre système RH avec d'autres services et applications.
            </p>
            
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium">Google Workspace</h3>
                    <p className="text-sm text-muted-foreground">
                      Connexion avec Google Agenda, Gmail et Drive.
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium">Microsoft 365</h3>
                    <p className="text-sm text-muted-foreground">
                      Connexion avec Outlook, Teams et OneDrive.
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium">Slack</h3>
                    <p className="text-sm text-muted-foreground">
                      Envoi de notifications et mises à jour vers les canaux Slack.
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium">QuickBooks</h3>
                    <p className="text-sm text-muted-foreground">
                      Synchronisation des données de paie avec votre système comptable.
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium">Accès API</h3>
                    <p className="text-sm text-muted-foreground">
                      Générer des clés API pour des intégrations personnalisées.
                    </p>
                  </div>
                  <Button variant="outline">Gérer les clés</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;
