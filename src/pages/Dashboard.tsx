
import { useEffect, useState } from "react";
import { Users, Calendar, DollarSign, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployees, EmployeeStatus } from "@/hooks/useEmployees";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const { data: employees, isLoading, error } = useEmployees();
  const [attendanceData, setAttendanceData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: "0",
    leaveRequests: "0",
    totalSalaries: "0 FCFA",
    avgWorkHours: "0h"
  });

  useEffect(() => {
    if (employees) {
      // Calcul des statistiques
      const totalEmployees = employees.length;
      const onLeaveCount = employees.filter(emp => emp.status === "on-leave").length;
      
      // Estimation des salaires (pour la démonstration)
      const avgSalary = 1100000; // Salaire moyen estimé
      const totalSalary = totalEmployees * avgSalary;
      
      setStats({
        totalEmployees: totalEmployees.toString(),
        leaveRequests: onLeaveCount.toString(),
        totalSalaries: `${(totalSalary).toLocaleString()} FCFA`,
        avgWorkHours: "8,2h" // Valeur fixe pour la démonstration
      });

      // Générer des données de présence par mois
      const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
      const attendanceChartData = months.map(name => {
        // Simuler des données d'assiduité basées sur le nombre d'employés
        const attendance = 85 + Math.floor(Math.random() * 10);
        const leave = 100 - attendance;
        return { name, attendance, leave };
      });
      setAttendanceData(attendanceChartData);

      // Générer des données de salaire par département
      const departments = new Set(employees.map(emp => emp.department));
      const salaryChartData = Array.from(departments).map(dept => {
        // Filtrer les employés par département
        const deptEmployees = employees.filter(emp => emp.department === dept);
        // Simuler une valeur de salaire moyenne pour le département
        const value = deptEmployees.length * avgSalary;
        return { name: dept, value };
      });
      setSalaryData(salaryChartData);
    }
  }, [employees]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <h2 className="text-lg font-semibold">Erreur de chargement</h2>
          <p>Une erreur s'est produite lors du chargement des données du tableau de bord.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Tableau de bord RH</h1>
        <p className="text-muted-foreground">Visualisation des données et statistiques RH.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employés"
          value={stats.totalEmployees}
          icon={<Users className="text-blue-500" />}
          trend={{ value: 4.5, positive: true }}
          className="bg-blue-50 border-blue-200"
        />
        <StatCard
          title="Demandes de congés"
          value={stats.leaveRequests}
          icon={<Calendar className="text-green-500" />}
          trend={{ value: 1.8, positive: false }}
          className="bg-green-50 border-green-200"
        />
        <StatCard
          title="Salaires totaux"
          value={stats.totalSalaries}
          icon={<DollarSign className="text-amber-500" />}
          trend={{ value: 2.3, positive: true }}
          className="bg-amber-50 border-amber-200"
        />
        <StatCard
          title="Heures travaillées moy."
          value={stats.avgWorkHours}
          icon={<Clock className="text-purple-500" />}
          trend={{ value: 0.5, positive: true }}
          className="bg-purple-50 border-purple-200"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 shadow-md">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Aperçu des présences</h2>
            <p className="text-sm text-muted-foreground">Présences quotidiennes vs congés</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  name="Présence"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorAttendance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-5 shadow-md">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Distribution des salaires</h2>
            <p className="text-sm text-muted-foreground">Salaire moyen par département</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                  formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Salaire moyen']}
                />
                <Bar 
                  dataKey="value" 
                  name="Salaire moyen" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
