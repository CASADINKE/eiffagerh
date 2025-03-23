
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV, formatDateFR } from "@/utils/exportUtils";
import { Tables } from "@/integrations/supabase/types";

type LeaveRequest = Tables<"leave_requests">;

interface ExportLeaveButtonProps {
  data: LeaveRequest[];
  isLoading?: boolean;
}

export function ExportLeaveButton({ data, isLoading = false }: ExportLeaveButtonProps) {
  const handleExport = () => {
    // Définition des entêtes pour le CSV
    const headers = {
      id: "ID",
      employee_id: "ID Employé",
      start_date: "Date de début",
      end_date: "Date de fin",
      type: "Type de congé",
      reason: "Motif",
      status: "Statut",
      comments: "Commentaires",
      created_at: "Créé le",
      updated_at: "Mis à jour le"
    };

    // Formater les données pour l'export
    const formattedData = data.map(leave => ({
      ...leave,
      start_date: formatDateFR(leave.start_date),
      end_date: formatDateFR(leave.end_date),
      created_at: formatDateFR(leave.created_at),
      updated_at: formatDateFR(leave.updated_at),
      status: getStatusLabel(leave.status),
      type: getTypeLabel(leave.type)
    }));

    // Export au format CSV
    exportToCSV(formattedData, "demandes-conges", headers);
  };

  // Fonction pour traduire les statuts
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "pending": return "En attente";
      case "approved": return "Approuvé";
      case "rejected": return "Refusé";
      default: return status;
    }
  };

  // Fonction pour traduire les types de congés
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "annual": return "Congé annuel";
      case "sick": return "Congé maladie";
      case "parental": return "Congé parental";
      case "other": return "Autre";
      default: return type;
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading || data.length === 0}
      variant="outline"
      size="sm"
      className="ml-2"
    >
      <Download className="mr-2 h-4 w-4" />
      Exporter CSV
    </Button>
  );
}
