
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
  Legend,
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
        <h1 className="text-3xl font-semibold">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue, voici ce qui se passe aujourd'hui.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employés"
          value="128"
          icon={<Users />}
          trend={{ value: 4.5, positive: true }}
        />
        <StatCard
          title="Demandes de congés"
          value="8"
          icon={<Calendar />}
          trend={{ value: 1.8, positive: false }}
        />
        <StatCard
          title="Salaires totaux"
          value="145 500 000 FCFA"
          icon={<DollarSign />}
          trend={{ value: 2.3, positive: true }}
        />
        <StatCard
          title="Heures travaillées moy."
          value="8,2h"
          icon={<Clock />}
          trend={{ value: 0.5, positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-5">
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
                  <linearGradient id="colorLeave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
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
                <Area
                  type="monotone"
                  dataKey="leave"
                  name="Congé"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorLeave)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-5">
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
                <Legend />
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

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Activités récentes</h2>
            <p className="text-sm text-muted-foreground">Dernières actions dans le système</p>
          </div>
          <ul className="space-y-4">
            {[
              { id: 1, action: "Nouvel employé ajouté", user: "Admin", time: "Il y a 2 heures" },
              { id: 2, action: "Demande de congé approuvée", user: "Manager", time: "Il y a 4 heures" },
              { id: 3, action: "Salaires mis à jour pour l'équipe de développement", user: "Responsable RH", time: "Hier" },
              { id: 4, action: "Rapport de pointage généré", user: "Admin", time: "Hier" },
              { id: 5, action: "Nouveau rôle ajouté au système", user: "Admin système", time: "Il y a 2 jours" },
            ].map((activity) => (
              <li key={activity.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">Par {activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
