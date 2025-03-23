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

// Mock time tracking data
const timeTrackingData = [
  {
    id: "1",
    employee: "Alex Johnson",
    position: "Développeur Frontend",
    clockIn: "09:05",
    clockOut: "18:10",
    totalHours: "9h 5m",
    breakTime: "1h",
    workingTime: "8h 5m",
    status: "completed",
    date: "2023-09-18",
  },
  {
    id: "2",
    employee: "Sarah Williams",
    position: "Responsable RH",
    clockIn: "08:55",
    clockOut: "17:50",
    totalHours: "8h 55m",
    breakTime: "45m",
    workingTime: "8h 10m",
    status: "completed",
    date: "2023-09-18",
  },
  {
    id: "3",
    employee: "Michael Brown",
    position: "Chef de Produit",
    clockIn: "09:15",
    clockOut: "18:30",
    totalHours: "9h 15m",
    breakTime: "1h",
    workingTime: "8h 15m",
    status: "completed",
    date: "2023-09-18",
  },
  {
    id: "4",
    employee: "Emily Davis",
    position: "Designer UI/UX",
    clockIn: "09:00",
    clockOut: "--:--",
    totalHours: "en cours",
    breakTime: "30m",
    workingTime: "en cours",
    status: "active",
    date: "2023-09-19",
  },
  {
    id: "5",
    employee: "Daniel Wilson",
    position: "Développeur Backend",
    clockIn: "08:45",
    clockOut: "--:--",
    totalHours: "en cours",
    breakTime: "1h",
    workingTime: "en cours",
    status: "active",
    date: "2023-09-19",
  },
];

// Weekly working hours data
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
  
  // Fixed type error by using correct equality check with string values
  const filteredTimeData = timeTrackingData.filter(
    record => 
      (dateFilter === "today" && record.date === "2023-09-19") ||
      (dateFilter === "yesterday" && record.date === "2023-09-18") ||
      dateFilter === "all"
  );
  
  // Time tracking metrics
  const activeEmployees = timeTrackingData.filter(
    record => record.status === "active" && record.date === "2023-09-19"
  ).length;
  
  // Fixed type error by providing a default for empty array and properly handling types
  const completedRecordsToday = timeTrackingData.filter(
    record => record.status === "completed" && record.date === "2023-09-19"
  );
  
  const averageHoursToday = completedRecordsToday.length > 0
    ? completedRecordsToday.reduce((acc, curr) => {
        // Handle the ongoing case where workingTime might be a string "ongoing"
        if (curr.workingTime === "en cours") return acc;
        
        const hours = parseFloat(curr.workingTime.split("h")[0]);
        const minutes = parseFloat(curr.workingTime.split("h ")[1]?.split("m")[0] || "0") / 60;
        return acc + hours + minutes;
      }, 0) / completedRecordsToday.length
    : 0;
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Pointage</h1>
          <p className="text-muted-foreground">Suivi des présences et des heures de travail des employés</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            <span>Exporter le rapport</span>
          </Button>
          <EmployeeTimeClockDialog className="gap-2" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Employés actifs"
          value={activeEmployees.toString()}
          icon={<Users />}
        />
        <StatCard
          title="Moyenne d'heures aujourd'hui"
          value={averageHoursToday ? `${averageHoursToday.toFixed(1)}h` : "N/A"}
          icon={<Clock />}
        />
        <StatCard
          title="Approbations en attente"
          value="3"
          icon={<Calendar />}
          trend={{ value: 2, positive: false }}
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
              
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par employé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  <SelectItem value="alex">Alex Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Williams</SelectItem>
                  <SelectItem value="michael">Michael Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="today" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Entrée</TableHead>
                    <TableHead>Sortie</TableHead>
                    <TableHead>Heures totales</TableHead>
                    <TableHead>Pause</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTimeData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employee}</TableCell>
                      <TableCell>{record.position}</TableCell>
                      <TableCell>{record.clockIn}</TableCell>
                      <TableCell>{record.clockOut}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                      <TableCell>{record.breakTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {record.status === "active" ? (
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
                        {record.status === "active" ? (
                          <Button variant="outline" size="sm" className="gap-1">
                            <Square size={14} />
                            <span>Pointer sortie</span>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-1">
                            <Play size={14} />
                            <span>Pointer entrée</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTimeData.length === 0 && (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">Aucun enregistrement trouvé pour le filtre sélectionné.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="yesterday" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Entrée</TableHead>
                    <TableHead>Sortie</TableHead>
                    <TableHead>Heures totales</TableHead>
                    <TableHead>Pause</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTimeData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employee}</TableCell>
                      <TableCell>{record.position}</TableCell>
                      <TableCell>{record.clockIn}</TableCell>
                      <TableCell>{record.clockOut}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                      <TableCell>{record.breakTime}</TableCell>
                      <TableCell>
                        <span>Terminé</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="m-0">
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">Sélectionnez une plage de dates pour consulter l'historique de pointage.</p>
              <Button>Choisir une plage de dates</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default TimeTracking;
