
import { useState, useEffect } from "react";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CalendarIcon, 
  Search, 
  FileDown, 
  FileText, 
  Clock, 
  Filter, 
  User,
  ArrowUpDown
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeePointage, calculatePointageDuration } from "@/hooks/useEmployeePointage";
import { useEmployees } from "@/hooks/useEmployees";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeTimeClockDialog } from "@/components/timeTracking/EmployeeTimeClockDialog";

const PointageAdmin = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSite, setFilterSite] = useState<string | null>(null);

  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const { pointages, loading } = useEmployeePointage(selectedEmployee);

  // Get unique sites from employees
  const sites = employees
    ? [...new Set(employees.map(e => e.site).filter(Boolean))]
    : [];

  // Filter pointages based on search, date, and site
  const filteredPointages = pointages.filter(pointage => {
    // Date filter
    if (date?.from && date?.to) {
      const pointageDate = new Date(pointage.date);
      if (
        pointageDate < date.from ||
        pointageDate > (date.to || date.from)
      ) {
        return false;
      }
    }

    // Search by employee name
    if (searchQuery) {
      const employeeName = pointage.employee.name.toLowerCase();
      const employeeMatricule = pointage.employee.matricule.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      
      if (!employeeName.includes(searchLower) && !employeeMatricule.includes(searchLower)) {
        return false;
      }
    }

    // Filter by site
    if (filterSite && pointage.employee.site !== filterSite) {
      return false;
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

  const exportToCSV = () => {
    // Implementation for CSV export
    console.log("Exporting to CSV");
  };

  const exportToPDF = () => {
    // Implementation for PDF export
    console.log("Exporting to PDF");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📊 Gestion des Pointages</h1>
        <EmployeeTimeClockDialog className="ml-auto" />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Affinez les données par employé, période ou site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Employé</label>
              <Select
                value={selectedEmployee || ""}
                onValueChange={(value) => setSelectedEmployee(value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employeesLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : (
                    employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.prenom} {employee.nom} ({employee.matricule})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Période</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(date.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Choisir une période</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Site</label>
              <Select
                value={filterSite || ""}
                onValueChange={(value) => setFilterSite(value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les sites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sites</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site} value={site}>
                      {site}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Registre des pointages</CardTitle>
              <CardDescription>
                {filteredPointages.length} pointages trouvés
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou matricule..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={exportToCSV}>
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
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
                  <TableHead>Entrée</TableHead>
                  <TableHead>Sortie</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPointages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Aucun pointage trouvé pour cette période
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPointages.map((pointage) => (
                    <TableRow key={pointage.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {pointage.employee.avatar ? (
                              <AvatarImage src={pointage.employee.avatar} alt={pointage.employee.name} />
                            ) : (
                              <AvatarFallback>{pointage.employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{pointage.employee.name}</div>
                            <div className="text-xs text-muted-foreground">{pointage.employee.matricule}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(pointage.date)}</TableCell>
                      <TableCell>{formatTime(pointage.clock_in)}</TableCell>
                      <TableCell>{formatTime(pointage.clock_out)}</TableCell>
                      <TableCell>
                        {calculatePointageDuration(pointage.clock_in, pointage.clock_out)}
                      </TableCell>
                      <TableCell>
                        {pointage.clock_in && pointage.clock_out ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Complet
                          </Badge>
                        ) : pointage.clock_in ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                            En cours
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            Non pointé
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Menu</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem>Supprimer</DropdownMenuItem>
                            {!pointage.clock_out && pointage.clock_in && (
                              <DropdownMenuItem>Pointer la sortie</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PointageAdmin;
