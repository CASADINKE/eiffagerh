
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { LeaveNotification } from "@/components/leave/LeaveNotification";
import { LeaveRequestDialog } from "@/components/leave/LeaveRequestDialog";
import { LeaveHeader } from "@/components/leave/LeaveHeader";
import { LeaveTabs } from "@/components/leave/LeaveTabs";
import { LeaveAdminPanel } from "@/components/leave/LeaveAdminPanel";
import { Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type LeaveRequest = Tables<"leave_requests">;

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeaveRequests(data || []);
    } catch (error: any) {
      console.error("Erreur lors du chargement des demandes:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de congés",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <LeaveNotification />
      
      <LeaveHeader 
        openLeaveRequestDialog={() => setIsDialogOpen(true)} 
        isLoading={isLoading}
        leaveRequests={leaveRequests}
      />

      {/* Panneau d'administration pour les super_admin */}
      <LeaveAdminPanel 
        leaveRequests={leaveRequests} 
        onUpdate={fetchLeaveRequests}
      />

      <Card className="shadow-sm border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-xl flex items-center text-blue-600">
            <Calendar className="mr-2 h-5 w-5" />
            Mes Demandes de Congés
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <LeaveTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            leaveRequests={leaveRequests}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <LeaveRequestDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSuccess={fetchLeaveRequests} 
      />
    </div>
  );
}

export default Leave;
