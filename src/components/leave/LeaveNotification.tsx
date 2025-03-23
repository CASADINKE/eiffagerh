
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type LeaveRequest = Tables<"leave_requests">;

export function LeaveNotification() {
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Abonnement aux changements en temps réel de la table leave_requests
    const channel = supabase
      .channel("leave-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "leave_requests",
        },
        (payload) => {
          const newRecord = payload.new as LeaveRequest;
          const oldRecord = payload.old as LeaveRequest;

          // Si le statut a changé, montrer une notification
          if (newRecord.status !== oldRecord.status) {
            const statusText = 
              newRecord.status === "approved" ? "approuvée" : 
              newRecord.status === "rejected" ? "refusée" : "mise à jour";

            // Notification via sonner (toast plus moderne)
            toast(`Demande de congé ${statusText}`, {
              description: `Votre demande de congé du ${formatDateRange(
                newRecord.start_date,
                newRecord.end_date
              )} a été ${statusText}.`,
              duration: 5000,
            });

            // Notification via useToast (toast standard de shadcn)
            uiToast({
              title: `Demande de congé ${statusText}`,
              description: `Votre demande de congé du ${formatDateRange(
                newRecord.start_date,
                newRecord.end_date
              )} a été ${statusText}.`,
              variant: newRecord.status === "approved" ? "default" : "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [uiToast]);

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return `${start.toLocaleDateString("fr-FR")} au ${end.toLocaleDateString("fr-FR")}`;
  };

  // Ce composant ne rend rien visuellement
  return null;
}
