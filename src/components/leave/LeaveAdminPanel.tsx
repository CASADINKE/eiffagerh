
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { LeaveTypeIcon } from "./LeaveTypeIcon";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

type LeaveRequest = Tables<"leave_requests">;

interface LeaveAdminPanelProps {
  leaveRequests: LeaveRequest[];
  onUpdate: () => void;
}

export function LeaveAdminPanel({ leaveRequests, onUpdate }: LeaveAdminPanelProps) {
  const { toast: uiToast } = useToast();
  const { user, userRole } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [status, setStatus] = useState<string>("pending");
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingRequests = leaveRequests.filter(
    (request) => request.status === "pending"
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), {
      addSuffix: true,
      locale: fr,
    });
  };

  const handleOpenDialog = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setComments(request.comments || "");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
    setStatus("pending");
    setComments("");
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: status,
          comments: comments,
          approved_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      toast.success("Demande de congé mise à jour", {
        description: `La demande de congé a été ${
          status === "approved" ? "approuvée" : "rejetée"
        } avec succès.`,
      });

      uiToast({
        title: "Demande mise à jour",
        description: `La demande de congé a été ${
          status === "approved" ? "approuvée" : "rejetée"
        } avec succès.`,
      });

      handleCloseDialog();
      onUpdate();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error.message);
      toast.error("Erreur de mise à jour", {
        description: "Une erreur est survenue lors de la mise à jour de la demande.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("leave_requests")
        .delete()
        .eq("id", selectedRequest.id);

      if (error) throw error;

      toast.success("Demande supprimée", {
        description: "La demande de congé a été supprimée avec succès.",
      });

      setIsDeleteDialogOpen(false);
      handleCloseDialog();
      onUpdate();
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error.message);
      toast.error("Erreur de suppression", {
        description: "Une erreur est survenue lors de la suppression de la demande.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si l'utilisateur n'est pas un super_admin, ne pas afficher le panneau
  if (userRole !== "super_admin") {
    return null;
  }

  return (
    <>
      <Card className="mt-6 shadow-sm border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-red-600">
            Administration des Demandes de Congé
          </CardTitle>
          <CardDescription>
            Vous pouvez approuver, rejeter ou supprimer les demandes de congé en attente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucune demande de congé en attente
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      <LeaveTypeIcon type={request.type} />
                      <div>
                        <span className="font-semibold">
                          {formatDate(request.start_date)} au {formatDate(request.end_date)}
                        </span>
                        <div className="text-sm text-muted-foreground">
                          Soumise {formatTimeAgo(request.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <LeaveStatusBadge status={request.status} />
                      <Button
                        size="sm"
                        onClick={() => handleOpenDialog(request)}
                      >
                        Examiner
                      </Button>
                    </div>
                  </div>
                  {request.reason && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Motif:</span> {request.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Examiner la demande de congé</DialogTitle>
            <DialogDescription>
              Approuvez, rejetez ou supprimez cette demande de congé.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date de début</Label>
                    <div className="font-medium">
                      {formatDate(selectedRequest.start_date)}
                    </div>
                  </div>
                  <div>
                    <Label>Date de fin</Label>
                    <div className="font-medium">
                      {formatDate(selectedRequest.end_date)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label>Type de congé</Label>
                <div className="font-medium flex items-center gap-2">
                  <LeaveTypeIcon type={selectedRequest.type} />
                  {selectedRequest.type === "paid" && "Congé payé"}
                  {selectedRequest.type === "unpaid" && "Congé non payé"}
                  {selectedRequest.type === "sick" && "Congé maladie"}
                  {selectedRequest.type === "maternity" && "Congé maternité"}
                  {selectedRequest.type === "paternity" && "Congé paternité"}
                </div>
              </div>

              {selectedRequest.reason && (
                <div className="space-y-1">
                  <Label>Motif</Label>
                  <div className="p-3 border rounded-md bg-slate-50 dark:bg-slate-800">
                    {selectedRequest.reason}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="status">Décision</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner une décision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuver</SelectItem>
                    <SelectItem value="rejected">Rejeter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="comments">Commentaires (optionnel)</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Ajouter un commentaire pour l'employé"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isSubmitting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button 
                onClick={handleUpdateRequest} 
                disabled={isSubmitting || status === "pending" || status === selectedRequest?.status}
              >
                {isSubmitting ? "Mise à jour..." : "Confirmer"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. La demande de congé sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRequest}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
