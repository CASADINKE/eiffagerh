
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
    return `status-badge ${status}`;
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

      <Card className="card-with-hover shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Mes Demandes de Congés
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="mb-6 bg-muted/80 p-1">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Toutes</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">En attente</TabsTrigger>
              <TabsTrigger value="approved" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Approuvées</TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Refusées</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date de début</TableHead>
                      <TableHead>Date de fin</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="loading-dots">
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          </div>
                          <span className="text-muted-foreground mt-2 block">Chargement des demandes de congés...</span>
                        </TableCell>
                      </TableRow>
                    ) : filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <Calendar className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                          <span className="text-muted-foreground">Aucune demande de congé trouvée</span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((leave) => (
                        <TableRow key={leave.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center">
                              {getTypeIcon(leave.type)}
                              <span className="ml-2">{getTypeLabel(leave.type)}</span>
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
              </div>
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
