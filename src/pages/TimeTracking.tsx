import { useState } from "react";
import { Calendar, Clock, Download, Filter, Play, Square, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EmployeeTimeClockDialog } from "@/components/timeTracking/EmployeeTimeClockDialog";
import { useTimeEntries, useClockOutMutation, calculateDuration, getActiveTimeEntry } from "@/hooks/useTimeEntries";
import { useEmployees } from "@/hooks/useEmployees";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { exportToCSV, formatDateFR } from "@/utils/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const workingHoursData = [
  { day: "Lun", hours: 8.2 },
  { day: "Mar", hours: 8.5 },
  { day: "Mer", hours: 7.8 },
  { day: "Jeu", hours: 8.3 },
  { day: "Ven", hours: 7.5 },
  { day: "Sam", hours: 4.2 },
  { day: "Dim", hours: 0 },
];

const TimeTracking = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [dateFilter, setDateFilter] = useState("today");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("month");

  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const { 
    data: timeEntries = [], 
    isLoading: entriesLoading,
    isError: entriesError
  } = useTimeEntries(employeeFilter !== "all" ? employeeFilter : undefined);
  const clockOutMutation = useClockOutMutation();

  const getFilterDate = (date: string) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");

  const filteredTimeEntries = timeEntries.filter(entry => {
    const entryDate = getFilterDate(entry.date);
    return (
      (dateFilter === "today" && entryDate === today) ||
      (dateFilter === "yesterday" && entryDate === yesterday) ||
      dateFilter === "all"
    );
  });

  const activeEmployeeCount = timeEntries.filter(
    entry => !entry.clock_out && getFilterDate(entry.date) === today
  ).length;

  const completedEntriesForToday = timeEntries.filter(
    entry => entry.clock_out && getFilterDate(entry.date) === today
  );

  const totalCompletedHours = completedEntriesForToday.reduce((acc, entry) => {
    const duration = calculateDuration(entry.clock_in, entry.clock_out, entry.break_time);
    if (duration === "en cours") return acc;
    
    const [hours, minutes] = duration.split("h ").map(part => parseFloat(part.replace("m", "")));
    return acc + hours + (minutes / 60 || 0);
  }, 0);

  const averageHours = completedEntriesForToday.length 
    ? (totalCompletedHours / completedEntriesForToday.length).toFixed(1) 
    : 0;

  const handleClockOut = (entryId: string) => {
    clockOutMutation.mutate(entryId);
  };

  const getInitials = (name: string = "") => {
    return name.split(" ").map(n => n[0]).join("");
  };

  const isLoading = employeesLoading || entriesLoading;

  const getExportFilename = () => {
    const today = new Date();
    const month = today.toLocaleString('fr', { month: 'long' });
    const year = today.getFullYear();
    
    if (dateFilter === "today") {
      return `pointages_${format(today, 'yyyy-MM-dd')}`;
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return `pointages_${format(yesterday, 'yyyy-MM-dd')}`;
    } else {
      if (periodFilter === "month") {
        return `pointages_${month}_${year}`;
      } else if (periodFilter === "quarter") {
        const quarter = Math.floor(today.getMonth() / 3) + 1;
        return `pointages_T${quarter}_${year}`;
      } else {
        return `pointages_annee_${year}`;
      }
    }
  };

  const formatDataForExport = (entries) => {
    return entries.map(entry => ({
      date: format(new Date(entry.date), "dd/MM/yyyy"),
      employee: entry.employee?.name || "Sans nom",
      department: entry.employee?.department || "Non assigné",
      clock_in: format(new Date(entry.clock_in), "HH:mm"),
      clock_out: entry.clock_out ? format(new Date(entry.clock_out), "HH:mm") : "--:--",
      duration: calculateDuration(entry.clock_in, entry.clock_out, entry.break_time),
      break_time: `${entry.break_time}m`,
      status: entry.clock_out ? "Terminé" : "Actif"
    }));
  };

  const handleExport = (format = 'csv') => {
    if (filteredTimeEntries.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }
    
    const exportData = formatDataForExport(filteredTimeEntries);
    const filename = getExportFilename();
    
    const headers = {
      date: "Date",
      employee: "Employé",
      department: "Département",
      clock_in: "Entrée",
      clock_out: "Sortie",
      duration: "Durée",
      break_time: "Pause",
      status: "Statut"
    };
    
    exportToCSV(exportData, filename, headers);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Pointage</h1>
          <p className="text-muted-foreground">Suivi des présences et des heures de travail des employés</p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download size={16} />
                <span>Exporter le rapport</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Exporter en CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EmployeeTimeClockDialog className="gap-2" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Employés actifs"
          value={activeEmployeeCount.toString()}
          icon={<Users />}
        />
        <StatCard
          title="Moyenne d'heures aujourd'hui"
          value={`${averageHours}h`}
          icon={<Clock />}
        />
        <StatCard
          title="Pointages à approuver"
          value={filteredTimeEntries.length.toString()}
          icon={<Calendar />}
        />
      </div>
      
      <Card className="mb-8">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">Heures de travail hebdomadaires</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workingHoursData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                  formatter={(value) => [`${value} heures`, 'Temps de travail']}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between p-4 border-b border-border">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="yesterday">Hier</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filtrer par date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="yesterday">Hier</SelectItem>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                </SelectContent>
              </Select>
              
              {dateFilter === "all" && (
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Mois courant</SelectItem>
                    <SelectItem value="quarter">Trimestre</SelectItem>
                    <SelectItem value="year">Année</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par employé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="today" className="m-0">
            {renderTimeEntriesTable()}
          </TabsContent>
          
          <TabsContent value="yesterday" className="m-0">
            {renderTimeEntriesTable()}
          </TabsContent>
          
          <TabsContent value="history" className="m-0">
            {renderTimeEntriesTable()}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );

  function renderTimeEntriesTable() {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Chargement des pointages...</p>
        </div>
      );
    }
    
    if (entriesError) {
      return (
        <div className="p-8 text-center text-destructive">
          <p>Une erreur est survenue lors du chargement des pointages.</p>
          <p className="text-sm text-muted-foreground mt-2">Veuillez réessayer ultérieurement.</p>
        </div>
      );
    }
    
    if (filteredTimeEntries.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Aucun pointage trouvé pour les critères sélectionnés.</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Entrée</TableHead>
              <TableHead>Sortie</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Pause</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTimeEntries.map((entry) => {
              const isActive = !entry.clock_out;
              const formattedClockIn = format(new Date(entry.clock_in), "HH:mm", { locale: fr });
              const formattedClockOut = entry.clock_out 
                ? format(new Date(entry.clock_out), "HH:mm", { locale: fr }) 
                : "--:--";
              const duration = calculateDuration(entry.clock_in, entry.clock_out, entry.break_time);
              const breakTime = `${entry.break_time}m`;
              
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    {entry.employee && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {entry.employee.avatar ? (
                            <AvatarImage src={entry.employee.avatar} alt={entry.employee.name} />
                          ) : (
                            <AvatarFallback>{getInitials(entry.employee.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        <span>{entry.employee.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{entry.employee?.department || "Non assigné"}</TableCell>
                  <TableCell>{formattedClockIn}</TableCell>
                  <TableCell>{formattedClockOut}</TableCell>
                  <TableCell>{duration}</TableCell>
                  <TableCell>{breakTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {isActive ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          <span>Actif</span>
                        </>
                      ) : (
                        <span>Terminé</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isActive ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleClockOut(entry.id)}
                      >
                        <Square size={14} />
                        <span>Pointer sortie</span>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-1" disabled>
                        <Clock size={14} />
                        <span>Terminé</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default TimeTracking;
