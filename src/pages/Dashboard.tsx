
import { Users, Calendar, DollarSign, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useEffect, useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { supabase } from "@/integrations/supabase/client";
import { useRemunerationsOperations } from "@/hooks/useRemunerationsOperations";

const Dashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState(0);
  const [avgHours, setAvgHours] = useState("8,2");
  const { data: employees } = useEmployees();
  const { stats } = useRemunerationsOperations();

  useEffect(() => {
    // Fetch leave requests count
    const fetchLeaveRequests = async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("id")
        .eq("status", "pending");
      
      if (!error && data) {
        setLeaveRequests(data.length);
      }
    };

    // Fetch average working hours
    const fetchAvgHours = async () => {
      const { data, error } = await supabase
        .from("time_entries")
        .select("clock_in, clock_out")
        .not("clock_out", "is", null)
        .limit(50);
      
      if (!error && data && data.length > 0) {
        let totalHours = 0;
        let count = 0;
        
        data.forEach(entry => {
          if (entry.clock_in && entry.clock_out) {
            const start = new Date(entry.clock_in);
            const end = new Date(entry.clock_out);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            if (hours > 0 && hours < 24) { // Filter out unrealistic values
              totalHours += hours;
              count++;
            }
          }
        });
        
        if (count > 0) {
          setAvgHours((totalHours / count).toFixed(1).replace(".", ","));
        }
      }
    };

    fetchLeaveRequests();
    fetchAvgHours();
  }, []);

  // Format total salary with proper spacing
  const formatSalary = (value: number) => {
    return value?.toLocaleString('fr-FR').replace(/,/g, ' ');
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Tableau de bord RH</h1>
        <p className="text-muted-foreground">Visualisation des données et statistiques RH.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employés"
          value={employees?.length?.toString() || "128"}
          icon={<Users className="text-blue-500" />}
          trend={{ value: 4.5, positive: true }}
          className="bg-blue-50 border-blue-200"
        />
        <StatCard
          title="Demandes de congés"
          value={leaveRequests.toString() || "8"}
          icon={<Calendar className="text-green-500" />}
          trend={{ value: 1.8, positive: false }}
          className="bg-green-50 border-green-200"
        />
        <StatCard
          title="Salaires totaux"
          value={`${formatSalary(stats?.totalSalaryMass || 145500000)} FCFA`}
          icon={<DollarSign className="text-amber-500" />}
          trend={{ value: 2.3, positive: true }}
          className="bg-amber-50 border-amber-200"
        />
        <StatCard
          title="Heures travaillées moy."
          value={`${avgHours}h`}
          icon={<Clock className="text-purple-500" />}
          trend={{ value: 0.5, positive: true }}
          className="bg-purple-50 border-purple-200"
        />
      </div>
    </div>
  );
};

export default Dashboard;
