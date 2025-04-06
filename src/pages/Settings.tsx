import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
}

interface PermissionGroup {
  id: string;
  name: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  checked: boolean;
}

const initialRoles: Role[] = [
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
];

const initialPermissionGroups: PermissionGroup[] = [
  {
    id: "employees",
    name: "Gestion des employés",
    permissions: [
      { id: "view-employees", name: "Voir les employés", checked: false },
      { id: "add-employees", name: "Ajouter des employés", checked: false },
      { id: "edit-employees", name: "Modifier les employés", checked: false },
      { id: "delete-employees", name: "Supprimer des employés", checked: false },
    ],
  },
  {
    id: "leaves",
    name: "Gestion des congés",
    permissions: [
      { id: "view-leaves", name: "Voir les congés", checked: false },
      { id: "approve-leaves", name: "Approuver les congés", checked: false },
      { id: "add-leave-types", name: "Ajouter des types de congés", checked: false },
    ],
  },
  {
    id: "salary",
    name: "Paie & Salaire",
    permissions: [
      { id: "view-salary", name: "Voir les salaires", checked: false },
      { id: "edit-salary", name: "Modifier les salaires", checked: false },
      { id: "run-payroll", name: "Exécuter la paie", checked: false },
    ],
  },
  {
    id: "time",
    name: "Suivi du temps",
    permissions: [
      { id: "view-time", name: "Voir les enregistrements de temps", checked: false },
      { id: "edit-time", name: "Modifier les enregistrements de temps", checked: false },
      { id: "approve-time", name: "Approuver les feuilles de temps", checked: false },
    ],
  },
  {
    id: "reports",
    name: "Rapports",
    permissions: [
      { id: "view-reports", name: "Voir les rapports", checked: false },
      { id: "export-reports", name: "Exporter les rapports", checked: false },
    ],
  },
  {
    id: "settings",
    name: "Paramètres système",
    permissions: [
      { id: "view-settings", name: "Voir les paramètres", checked: false },
      { id: "edit-settings", name: "Modifier les paramètres", checked: false },
      { id: "manage-roles", name: "Gérer les rôles", checked: false },
    ],
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(initialPermissionGroups);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  const handlePermissionChange = (groupId: string, permissionId: string, checked: boolean) => {
    setPermissionGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            permissions: group.permissions.map(permission => 
              permission.id === permissionId 
                ? { ...permission, checked } 
                : permission
            )
          };
        }
        return group;
      })
    );
  };

  const handleSaveChanges = () => {
    toast.success("Modifications enregistrées avec succès");
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast.error("Le nom du rôle est requis");
      return;
    }

    const newRole: Role = {
      id: `${roles.length + 1}`,
      name: newRoleName,
      description: newRoleDescription || "Pas de description",
      usersCount: 0,
      permissions: [],
    };

    setRoles([...roles, newRole]);
    setNewRoleName("");
    setNewRoleDescription("");
    setShowAddRoleDialog(false);
    toast.success("Nouveau rôle ajouté avec succès");
  };

  const handleEditRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      
      const updatedPermissionGroups = permissionGroups.map(group => ({
        ...group,
        permissions: group.permissions.map(permission => ({
          ...permission,
          checked: role.permissions.includes(group.id) || role.permissions.includes("all")
        }))
      }));
      
      setPermissionGroups(updatedPermissionGroups);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
    toast.success("Rôle supprimé avec succès");
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez la configuration de votre système RH</p>
      </div>
      
      <Card className="bg-[#1a202c] border-slate-700">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full p-0 bg-[#1a202c] rounded-none border-b border-slate-700">
            <TabsTrigger 
              value="roles" 
              className={cn(
                "gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 bg-[#1a202c] text-gray-300",
                activeTab === "roles" && "text-white"
              )}
            >
              <Shield size={16} />
              <span>Rôles & Permissions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="company" 
              className={cn(
                "gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 bg-[#1a202c] text-gray-300",
                activeTab === "company" && "text-white"
              )}
            >
              <Building size={16} />
              <span>Entreprise</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className={cn(
                "gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 bg-[#1a202c] text-gray-300",
                activeTab === "notifications" && "text-white"
              )}
            >
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className={cn(
                "gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 bg-[#1a202c] text-gray-300",
                activeTab === "integrations" && "text-white"
              )}
            >
              <Mail size={16} />
              <span>Intégrations</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles" className="p-6 text-white">
            <div className="flex justify-between mb-6 items-center">
              <h2 className="text-xl font-semibold">Rôles & Permissions</h2>
              <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    Ajouter un nouveau rôle
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a202c] text-white border-slate-700">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau rôle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="role-name">Nom du rôle</Label>
                      <Input 
                        id="role-name" 
                        value={newRoleName} 
                        onChange={(e) => setNewRoleName(e.target.value)} 
                        placeholder="Nom du rôle"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role-description">Description</Label>
                      <Input 
                        id="role-description" 
                        value={newRoleDescription} 
                        onChange={(e) => setNewRoleDescription(e.target.value)} 
                        placeholder="Description du rôle"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddRoleDialog(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddRole} className="bg-blue-600 hover:bg-blue-700">
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Table className="border-slate-700">
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-700 hover:bg-slate-800/80">
                  <TableHead className="text-gray-300">Nom du rôle</TableHead>
                  <TableHead className="text-gray-300">Description</TableHead>
                  <TableHead className="text-gray-300">Utilisateurs</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} className="border-slate-700 hover:bg-slate-800/50">
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.usersCount}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => handleEditRole(role.id)}
                      >
                        Modifier
                      </Button>
                      {role.name !== "Administrateur" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Groupes de permissions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {permissionGroups.map((group) => (
                  <Card key={group.id} className="p-4 bg-[#111827] border-slate-700">
                    <h4 className="text-md font-medium mb-3">{group.name}</h4>
                    <div className="space-y-2">
                      {group.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={permission.id} 
                            checked={permission.checked}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(group.id, permission.id, checked === true)
                            }
                            className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <label htmlFor={permission.id} className="text-sm text-gray-300">
                            {permission.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSaveChanges}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="company" className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-white">Paramètres de l'entreprise</h2>
            
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
            <h2 className="text-xl font-semibold mb-6 text-white">Paramètres de notifications</h2>
            
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
            <h2 className="text-xl font-semibold mb-6 text-white">Intégrations</h2>
            
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
