
import { Users, Calendar, DollarSign, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
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

const chartData = [
  { name: "Jan", attendance: 92, leave: 8 },
  { name: "Fév", attendance: 90, leave: 10 },
  { name: "Mar", attendance: 94, leave: 6 },
  { name: "Avr", attendance: 88, leave: 12 },
  { name: "Mai", attendance: 96, leave: 4 },
  { name: "Juin", attendance: 91, leave: 9 },
];

const salaryData = [
  { name: "Ingénierie", value: 650000 },
  { name: "Marketing", value: 500000 },
  { name: "Ventes", value: 550000 },
  { name: "RH", value: 450000 },
  { name: "Finance", value: 600000 },
];

const Dashboard = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Visualisation des données et statistiques RH.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employés"
          value="128"
          icon={<Users className="text-blue-500" />}
          trend={{ value: 4.5, positive: true }}
          className="bg-blue-50 border-blue-200"
        />
        <StatCard
          title="Demandes de congés"
          value="8"
          icon={<Calendar className="text-green-500" />}
          trend={{ value: 1.8, positive: false }}
          className="bg-green-50 border-green-200"
        />
        <StatCard
          title="Salaires totaux"
          value="145 500 000 FCFA"
          icon={<DollarSign className="text-amber-500" />}
          trend={{ value: 2.3, positive: true }}
          className="bg-amber-50 border-amber-200"
        />
        <StatCard
          title="Heures travaillées moy."
          value="8,2h"
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
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
