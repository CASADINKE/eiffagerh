import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Search, FileDown, FileText, Loader2, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePointages } from "@/hooks/usePointages";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useClockInMutation, useClockOutMutation, useTimeEntries, getActiveTimeEntry } from "@/hooks/timeEntries";
import { useEmployeesUI } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { EmployeeTimeClockDialog } from "@/components/timeTracking/EmployeeTimeClockDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmployeeUI } from "@/types/employee";

const Pointage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [searchDate, setSearchDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showClockInDialog, setShowClockInDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const { user } = useAuth();
  
  const userId = user?.id || "1";

  const {
    historyPointages,
    loading: pointagesLoading,
    calculateWorkDuration,
  } = usePointages(userId);

  const { data: employees = [], isLoading: employeesLoading } = useEmployeesUI();
  const { data: timeEntries = [], isLoading: entriesLoading } = useTimeEntries();
  
  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  const handleClockInDialogOpen = () => {
    setShowClockInDialog(true);
  };

  const handleClockIn = async (employeeId: string, notes?: string) => {
    try {
      await clockInMutation.mutateAsync({ 
        employeeId,
        notes: notes || "Pointé via l'application"
      });
      
      toast.success("Pointage d'entrée enregistré avec succès");
      setShowClockInDialog(false);
    } catch (error) {
      console.error("Error clocking in:", error);
      toast.error("Erreur lors du pointage d'entrée");
    }
  };

  const handleClockOut = async (entryId: string) => {
    try {
      await clockOutMutation.mutateAsync(entryId);
      toast.success("Pointage de sortie enregistré avec succès");
    } catch (error) {
      console.error("Error clocking out:", error);
      toast.error("Erreur lors du pointage de sortie");
    }
  };

  const filterHistoryByDate = () => {
    if (!searchDate) return historyPointages;
    
    return historyPointages.filter(
      pointage => pointage.date === searchDate
    );
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "HH:mm");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const getStatusBadge = (status: 'present' | 'en_retard' | 'absent') => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Présent</Badge>;
      case 'en_retard':
        return <Badge variant="warning">En retard</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const today = format(new Date(), "yyyy-MM-dd");
  
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todaysEntries = timeEntries.filter(entry => entry.date === today);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const getEmployeeClockStatus = (employeeId: string) => {
    const entry = todaysEntries.find(entry => 
      entry.employee_id === employeeId && !entry.clock_out
    );
    return entry;
  };

  const filteredHistory = filterHistoryByDate();
  const isLoading = pointagesLoading || employeesLoading || entriesLoading;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📍 Pointage des employés</h1>
        <Button size="lg" onClick={handleClockInDialogOpen}>
          🟢 Pointer l'entrée
        </Button>
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
                  placeholder="Recherche par nom ou matricule"
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
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="employees">Liste des employés</TabsTrigger>
          <TabsTrigger value="history">Historique de pointage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Pointage des employés aujourd'hui</CardTitle>
              <CardDescription>
                Gérez le pointage des employés pour la journée du {format(new Date(), "dd/MM/yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <UserCheck className="h-5 w-5 mr-2 text-green-500" />
                        Employés pointés
                      </h3>
                      <div className="border rounded-md">
                        {filteredEmployees.filter(emp => getEmployeeClockStatus(emp.id)).length === 0 ? (
                          <p className="text-muted-foreground p-4 text-center">Aucun employé n'a pointé aujourd'hui</p>
                        ) : (
                          <div className="divide-y">
                            {filteredEmployees
                              .filter(emp => getEmployeeClockStatus(emp.id))
                              .map(employee => {
                                const activeEntry = getEmployeeClockStatus(employee.id);
                                return (
                                  <div key={employee.id} className="flex items-center justify-between p-3">
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2">
                                        {employee.avatar ? (
                                          <AvatarImage src={employee.avatar} alt={employee.name} />
                                        ) : (
                                          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                        )}
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{employee.name}</p>
                                        <p className="text-xs text-muted-foreground">{employee.matricule}</p>
                                      </div>
                                    </div>
                                    {activeEntry && (
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleClockOut(activeEntry.id)}
                                      >
                                        Sortie
                                      </Button>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <UserX className="h-5 w-5 mr-2 text-red-500" />
                        Employés non pointés
                      </h3>
                      <div className="border rounded-md">
                        {filteredEmployees.filter(emp => !getEmployeeClockStatus(emp.id)).length === 0 ? (
                          <p className="text-muted-foreground p-4 text-center">Tous les employés ont pointé aujourd'hui</p>
                        ) : (
                          <div className="divide-y">
                            {filteredEmployees
                              .filter(emp => !getEmployeeClockStatus(emp.id))
                              .map(employee => (
                                <div key={employee.id} className="flex items-center justify-between p-3">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      {employee.avatar ? (
                                        <AvatarImage src={employee.avatar} alt={employee.name} />
                                      ) : (
                                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{employee.name}</p>
                                      <p className="text-xs text-muted-foreground">{employee.matricule}</p>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => handleClockIn(employee.id)}
                                  >
                                    Entrée
                                  </Button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique de pointage</CardTitle>
              <CardDescription>
                Consultez l'historique des pointages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pointagesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Entrée</TableHead>
                      <TableHead>Sortie</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          Aucun pointage trouvé pour cette période
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.map((pointage) => (
                        <TableRow key={pointage.id}>
                          <TableCell>{formatDate(pointage.date)}</TableCell>
                          <TableCell>{formatTime(pointage.heure_entree)}</TableCell>
                          <TableCell>{formatTime(pointage.heure_sortie)}</TableCell>
                          <TableCell>
                            {calculateWorkDuration(pointage.heure_entree, pointage.heure_sortie)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(pointage.statut)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <EmployeeTimeClockDialog 
        open={showClockInDialog} 
        onOpenChange={setShowClockInDialog}
        onClockIn={handleClockIn}
        className=""
      />
    </div>
  );
};

export default Pointage;
