
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Search, 
  FileDown, 
  Edit, 
  Calendar, 
  UserCog, 
  Filter, 
  MoreVertical,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployeesUI } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useEmployeePointage, calculatePointageDuration } from "@/hooks/useEmployeePointage";
import { EmployeePointagesTable } from "@/components/timeTracking/EmployeePointagesTable";
import { DialogContent, DialogHeader, DialogTitle, Dialog, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const SuiviPointages = () => {
  const [employeeFilter, setEmployeeFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  
  const { user, userRole } = useAuth();
  const isAdminOrHR = userRole === 'admin' || userRole === 'rh' || userRole === 'super_admin';
  
  const { data: employees = [], isLoading: employeesLoading } = useEmployeesUI();
  const { pointages, loading, error, updatePointage } = useEmployeePointage(employeeFilter);
  
  const filteredPointages = pointages.filter(entry => {
    // Apply date filter
    if (dateFilter) {
      const entryDate = new Date(entry.date);
      const filterDate = new Date(dateFilter);
      
      if (
        entryDate.getDate() !== filterDate.getDate() ||
        entryDate.getMonth() !== filterDate.getMonth() ||
        entryDate.getFullYear() !== filterDate.getFullYear()
      ) {
        return false;
      }
    }
    
    // Apply status filter
    if (statusFilter && entry.employee.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      return (
        entry.employee.name.toLowerCase().includes(searchLower) ||
        entry.employee.matricule?.toLowerCase().includes(searchLower) ||
        entry.employee.site?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "HH:mm");
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };
  
  const getStatusBadge = (clockIn: string | null, clockOut: string | null) => {
    if (!clockIn) return <Badge variant="destructive">Absent</Badge>;
    if (!clockOut) return <Badge variant="warning">En cours</Badge>;
    return <Badge variant="success">Complet</Badge>;
  };
  
  const handleEditEntry = (entry: any) => {
    setSelectedEntry(entry);
    setEditDialogOpen(true);
  };
  
  const handleUpdateEntry = async () => {
    if (!selectedEntry) return;
    
    try {
      // Update the entry in the database
      await updatePointage(selectedEntry.id, {
        clock_in: selectedEntry.clock_in,
        clock_out: selectedEntry.clock_out,
        notes: selectedEntry.notes
      });
      
      toast.success("Pointage mis à jour avec succès");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du pointage");
    }
  };
  
  const handleExportData = () => {
    toast.success("Export en cours...");
    // Implement export functionality here
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <UserCog className="mr-3 h-8 w-8" />
          Suivi des Pointages
        </h1>
        <div className="flex gap-2">
          <Button onClick={handleExportData}>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Filtrer les pointages par date, employé ou statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un employé..."
                  className="pl-8"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={employeeFilter || ""} onValueChange={(value) => setEmployeeFilter(value || null)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tous les employés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les employés</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "dd MMMM yyyy", { locale: fr }) : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFilter}
                  onSelect={(date) => {
                    setDateFilter(date);
                    setOpenCalendar(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="present">Présent</SelectItem>
                <SelectItem value="en_retard">En retard</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" onClick={() => {
              setEmployeeFilter(null);
              setDateFilter(undefined);
              setStatusFilter(null);
              setSearchFilter("");
            }}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pointages des employés</CardTitle>
          <CardDescription>
            Historique des pointages {dateFilter ? `du ${format(dateFilter, "dd MMMM yyyy", { locale: fr })}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Arrivée</TableHead>
                    <TableHead>Départ</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Remarques</TableHead>
                    {isAdminOrHR && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPointages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isAdminOrHR ? 8 : 7} className="text-center h-24 text-muted-foreground">
                        Aucun pointage trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPointages.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{entry.employee.name}</div>
                            <div className="text-xs text-muted-foreground">{entry.employee.matricule}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell>{formatTime(entry.clock_in)}</TableCell>
                        <TableCell>{formatTime(entry.clock_out)}</TableCell>
                        <TableCell>{calculatePointageDuration(entry.clock_in, entry.clock_out)}</TableCell>
                        <TableCell>{getStatusBadge(entry.clock_in, entry.clock_out)}</TableCell>
                        <TableCell className="max-w-[150px] truncate" title={entry.notes || ""}>
                          {entry.notes || "-"}
                        </TableCell>
                        {isAdminOrHR && (
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le pointage</DialogTitle>
            <DialogDescription>
              Modifiez les informations de pointage pour cet employé.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure d'arrivée</label>
                  <Input 
                    type="datetime-local" 
                    value={selectedEntry.clock_in ? new Date(selectedEntry.clock_in).toISOString().slice(0, 16) : ""}
                    onChange={(e) => {
                      setSelectedEntry({
                        ...selectedEntry,
                        clock_in: e.target.value ? new Date(e.target.value).toISOString() : null
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de départ</label>
                  <Input 
                    type="datetime-local" 
                    value={selectedEntry.clock_out ? new Date(selectedEntry.clock_out).toISOString().slice(0, 16) : ""}
                    onChange={(e) => {
                      setSelectedEntry({
                        ...selectedEntry,
                        clock_out: e.target.value ? new Date(e.target.value).toISOString() : null
                      });
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Remarques</label>
                <Input 
                  value={selectedEntry.notes || ""}
                  onChange={(e) => {
                    setSelectedEntry({
                      ...selectedEntry,
                      notes: e.target.value
                    });
                  }}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateEntry}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuiviPointages;
