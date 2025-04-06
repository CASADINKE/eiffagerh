
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Search, FileDown, FileText, Edit, Trash2, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Pointage {
  id: string;
  user_id: string;
  date_pointage: string;
  heure_arrivee: string | null;
  heure_depart: string | null;
  duree_travail: string | null;
  remarque: string | null;
  statut: string;
  created_at: string;
  updated_at: string;
  user_full_name?: string;
}

interface PointageEditData {
  id: string;
  heure_arrivee: string | null;
  heure_depart: string | null;
  remarque: string | null;
}

const SuiviPointages = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [pointages, setPointages] = useState<Pointage[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<PointageEditData | null>(null);
  const [activeTab, setActiveTab] = useState("today");
  const { userRole } = useAuth();

  const canEdit = userRole === 'admin' || userRole === 'rh' || userRole === 'super_admin';

  useEffect(() => {
    fetchPointages();
    fetchEmployees();
  }, [month, searchDate, selectedEmployee, activeTab]);

  const fetchPointages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('pointages')
        .select(`
          *,
          user_id,
          profiles!pointages_user_id_fkey(full_name)
        `)
        .order('date_pointage', { ascending: false });
      
      // Filter by user if selected
      if (selectedEmployee !== "all") {
        query = query.eq('user_id', selectedEmployee);
      }
      
      // Filter by date/month
      if (searchDate) {
        // Specific date filter
        query = query.eq('date_pointage', searchDate);
      } else {
        // Month filter
        const startDate = format(new Date(month.getFullYear(), month.getMonth(), 1), 'yyyy-MM-dd');
        const endDate = format(new Date(month.getFullYear(), month.getMonth() + 1, 0), 'yyyy-MM-dd');
        query = query.gte('date_pointage', startDate).lte('date_pointage', endDate);
      }
      
      // Filter by current day/yesterday for tabs
      if (activeTab === "today") {
        const today = format(new Date(), 'yyyy-MM-dd');
        query = query.eq('date_pointage', today);
      } else if (activeTab === "yesterday") {
        const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
        query = query.eq('date_pointage', yesterday);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map to add user name to each record
      const formattedData = data.map(item => ({
        ...item,
        user_full_name: item.profiles?.full_name || "Inconnu"
      }));
      
      setPointages(formattedData);
    } catch (error) {
      console.error('Error fetching pointages:', error);
      toast.error("Erreur lors du chargement des pointages");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      
      if (error) throw error;
      
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Calculate work duration
  const calculateWorkDuration = (heureArrivee: string | null, heureDepart: string | null): string => {
    if (!heureArrivee) return "00h 00min";
    
    const startTime = new Date(heureArrivee);
    const endTime = heureDepart ? new Date(heureDepart) : new Date();
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}min`;
  };

  const handleEditPointage = (pointage: Pointage) => {
    if (!canEdit) {
      toast.error("Vous n'avez pas les permissions pour modifier les pointages");
      return;
    }
    
    setEditData({
      id: pointage.id,
      heure_arrivee: pointage.heure_arrivee,
      heure_depart: pointage.heure_depart,
      remarque: pointage.remarque
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    
    try {
      // Calculate duration
      const duration = calculateWorkDuration(editData.heure_arrivee, editData.heure_depart);
      
      const { error } = await supabase
        .from('pointages')
        .update({
          heure_arrivee: editData.heure_arrivee,
          heure_depart: editData.heure_depart,
          duree_travail: editData.heure_arrivee && editData.heure_depart ? duration : null,
          remarque: editData.remarque,
          statut: 'modifié'
        })
        .eq('id', editData.id);
      
      if (error) throw error;
      
      toast.success("Pointage modifié avec succès");
      fetchPointages(); // Refresh data
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating pointage:', error);
      toast.error("Erreur lors de la modification du pointage");
    }
  };

  const handleDeletePointage = async (id: string) => {
    if (!canEdit) {
      toast.error("Vous n'avez pas les permissions pour supprimer les pointages");
      return;
    }
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce pointage ? Cette action est irréversible.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('pointages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Pointage supprimé avec succès");
      fetchPointages(); // Refresh data
    } catch (error) {
      console.error('Error deleting pointage:', error);
      toast.error("Erreur lors de la suppression du pointage");
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "HH:mm");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const filteredPointages = pointages.filter(pointage => 
    pointage.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📍 Suivi des Pointages</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Recherche et filtres</CardTitle>
            <CardDescription>
              Recherchez un employé ou filtrez par date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Recherche par nom d'employé"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-8 w-48"
                  onChange={(e) => setSearchDate(e.target.value)}
                  value={searchDate}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-32 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(month, "MMMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={month}
                    onSelect={(date) => date && setMonth(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>
              Sélectionnez une date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) {
                  setSearchDate(format(newDate, 'yyyy-MM-dd'));
                }
              }}
              month={month}
              onMonthChange={setMonth}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between p-4 border-b border-border">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="yesterday">Hier</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Arrivée</TableHead>
                    <TableHead>Départ</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Remarque</TableHead>
                    {canEdit && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPointages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-6 text-muted-foreground">
                        Aucun pointage trouvé pour cette période
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPointages.map((pointage) => (
                      <TableRow key={pointage.id}>
                        <TableCell>{pointage.user_full_name}</TableCell>
                        <TableCell>{formatDate(pointage.date_pointage)}</TableCell>
                        <TableCell>{formatTime(pointage.heure_arrivee)}</TableCell>
                        <TableCell>{formatTime(pointage.heure_depart)}</TableCell>
                        <TableCell>
                          {pointage.duree_travail || calculateWorkDuration(pointage.heure_arrivee, pointage.heure_depart)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              pointage.statut === 'modifié' 
                                ? "outline" 
                                : pointage.heure_depart 
                                  ? "success" 
                                  : "warning"
                            }
                          >
                            {pointage.statut === 'modifié' 
                              ? "Modifié" 
                              : pointage.heure_depart 
                                ? "Terminé" 
                                : "En cours"}
                          </Badge>
                        </TableCell>
                        <TableCell>{pointage.remarque || "-"}</TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditPointage(pointage)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeletePointage(pointage.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Tabs>
      </Card>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le pointage</DialogTitle>
            <DialogDescription>
              Modifiez les informations de pointage ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Heure d'arrivée</label>
              <Input
                type="datetime-local"
                value={editData?.heure_arrivee?.split('.')[0] || ''}
                onChange={(e) => setEditData(prev => prev ? {...prev, heure_arrivee: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Heure de départ</label>
              <Input
                type="datetime-local"
                value={editData?.heure_depart?.split('.')[0] || ''}
                onChange={(e) => setEditData(prev => prev ? {...prev, heure_depart: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Remarque</label>
              <Textarea
                value={editData?.remarque || ''}
                onChange={(e) => setEditData(prev => prev ? {...prev, remarque: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuiviPointages;
