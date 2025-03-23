
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

type LeaveRequest = Tables<"leave_requests">;

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
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
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="p-4 md:p-6">
      <LeaveNotification />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Congés</h1>
        <div className="flex gap-2">
          <Button variant="default">Nouvelle Demande</Button>
          <ExportLeaveButton data={leaveRequests} isLoading={isLoading} />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Mes Demandes de Congés</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="approved">Approuvées</TabsTrigger>
              <TabsTrigger value="rejected">Refusées</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
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
                          Chargement des demandes de congés...
                        </TableCell>
                      </TableRow>
                    ) : filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          Aucune demande de congé trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell>{getTypeLabel(leave.type)}</TableCell>
                          <TableCell>{formatDate(leave.start_date)}</TableCell>
                          <TableCell>{formatDate(leave.end_date)}</TableCell>
                          <TableCell>{leave.reason || "-"}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                leave.status
                              )}`}
                            >
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
    </div>
  );
};

export default Leave;
