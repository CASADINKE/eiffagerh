
import { Users, Calendar, DollarSign, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

const Dashboard = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Tableau de bord RH</h1>
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
    </div>
  );
};

export default Dashboard;
