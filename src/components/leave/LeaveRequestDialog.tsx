
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeaveRequestForm } from "./LeaveRequestForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useEmployees } from "@/hooks/useEmployees";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { asNotifications } from "@/integrations/supabase/types-notifications";

interface LeaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Define the form schema to match LeaveRequestForm
const LeaveFormSchema = z.object({
  employee_id: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  type: z.string(),
  reason: z.string().optional(),
});

// Type based on the schema
type LeaveFormValues = z.infer<typeof LeaveFormSchema>;

export function LeaveRequestDialog({
  open,
  onOpenChange,
  onSuccess,
}: LeaveRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { user } = useAuth();
  
  const handleSubmit = async (formData: LeaveFormValues) => {
    setIsSubmitting(true);
    try {
      // Get the selected employee or use the first one if none is selected
      const employee_id = formData.employee_id || 
        (employees && employees.length > 0 ? employees[0].id : null);
      
      if (!employee_id) {
        throw new Error("Aucun employé sélectionné ou disponible");
      }

      // Find the employee details to include in notification
      const selectedEmployee = employees?.find(emp => emp.id === employee_id);
      // Format the employee name from nom and prenom fields
      const employeeName = selectedEmployee ? 
        `${selectedEmployee.prenom || ''} ${selectedEmployee.nom || ''}`.trim() : 
        "Un employé";

      // Format dates for display
      const startDate = formData.start_date.toLocaleDateString('fr-FR');
      const endDate = formData.end_date.toLocaleDateString('fr-FR');

      // Insert the leave request
      const { data: leaveRequest, error } = await supabase.from("leave_requests").insert({
        type: formData.type,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        reason: formData.reason || null,
        status: "pending",
        employee_id: employee_id,
      }).select('*').single();

      if (error) throw error;

      // Get all super_admin users to notify them
      const { data: adminUsers } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'super_admin');

      if (adminUsers && adminUsers.length > 0) {
        // Create notifications in the database for admins
        const notifications = adminUsers.map(admin => ({
          user_id: admin.id,
          title: "Nouvelle demande de congé",
          message: `${employeeName} a soumis une demande de congé du ${startDate} au ${endDate}`,
          read: false,
          created_at: new Date().toISOString(),
          related_id: leaveRequest.id,
          type: 'leave_request'
        }));

        // Insert notifications - using type assertion with any as a workaround
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications as any);

        if (notificationError) {
          console.error("Erreur lors de l'envoi des notifications:", notificationError);
        }
      }

      // Afficher les deux types de notifications
      toast({
        title: "Demande envoyée",
        description: "Votre demande de congé a été soumise avec succès",
      });

      sonnerToast.success("Demande de congé envoyée", {
        description: "Vous recevrez une notification lorsque votre demande sera traitée.",
        duration: 5000,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre votre demande de congé",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Nouvelle demande de congé</DialogTitle>
        </DialogHeader>
        <LeaveRequestForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting || employeesLoading}
          employees={employees || []}
        />
      </DialogContent>
    </Dialog>
  );
}
