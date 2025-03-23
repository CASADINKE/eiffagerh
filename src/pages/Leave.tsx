
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { ExportLeaveButton } from "@/components/leave/ExportLeaveButton";
import { LeaveNotification } from "@/components/leave/LeaveNotification";
import { LeaveRequestDialog } from "@/components/leave/LeaveRequestDialog";
import { Calendar, FileText, Clock } from "lucide-react";

type LeaveRequest = Tables<"leave_requests">;

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium";
      case "approved":
        return "bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium";
      case "rejected":
        return "bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium";
      default:
        return "bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Refusé";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "annual":
        return "Congé annuel";
      case "sick":
        return "Congé maladie";
      case "parental":
        return "Congé parental";
      case "other":
        return "Autre";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "annual":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "sick":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "parental":
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Filtrer les demandes de congés en fonction de l'onglet actif
  const getFilteredLeaveRequests = () => {
    if (activeTab === "all") {
      return leaveRequests;
    }
    return leaveRequests.filter(leave => leave.status === activeTab);
  };

  const filteredRequests = getFilteredLeaveRequests();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <LeaveNotification />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Congés</h1>
          <p className="text-muted-foreground mt-1">Visualisez et gérez vos demandes de congés</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="default" 
            size="lg" 
            className="text-base px-6 py-5 shadow-sm transition-all duration-200 hover:shadow"
            onClick={() => setIsDialogOpen(true)}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Nouvelle Demande
          </Button>
          <ExportLeaveButton data={leaveRequests} isLoading={isLoading} />
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-xl flex items-center text-blue-600">
            <Calendar className="mr-2 h-5 w-5" />
            Mes Demandes de Congés
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="flex p-0 h-12 bg-transparent border-b">
              <TabsTrigger 
                value="all" 
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                Toutes
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                En attente
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                Approuvées
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                Refusées
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-foreground/90 w-1/5">Type</TableHead>
                    <TableHead className="font-semibold text-foreground/90 w-1/5">Date de début</TableHead>
                    <TableHead className="font-semibold text-foreground/90 w-1/5">Date de fin</TableHead>
                    <TableHead className="font-semibold text-foreground/90 w-1/5">Motif</TableHead>
                    <TableHead className="font-semibold text-foreground/90 w-1/5">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="animate-pulse flex space-x-1">
                            <div className="h-2.5 w-2.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                            <div className="h-2.5 w-2.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                            <div className="h-2.5 w-2.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                          </div>
                        </div>
                        <span className="text-muted-foreground mt-2 block">Chargement des demandes de congés...</span>
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16">
                        <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                        <span className="text-muted-foreground">Aucune demande de congé trouvée</span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((leave) => (
                      <TableRow key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <TableCell>
                          <div className="flex items-center">
                            {getTypeIcon(leave.type)}
                            <span className="ml-2 font-medium">{getTypeLabel(leave.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(leave.start_date)}</TableCell>
                        <TableCell>{formatDate(leave.end_date)}</TableCell>
                        <TableCell>{leave.reason || "-"}</TableCell>
                        <TableCell>
                          <span className={getStatusBadgeClass(leave.status)}>
                            {getStatusLabel(leave.status)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <LeaveRequestDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSuccess={fetchLeaveRequests} 
      />
    </div>
  );
};

export default Leave;
