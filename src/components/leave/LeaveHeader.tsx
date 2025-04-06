
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { ExportLeaveButton } from "./ExportLeaveButton";

interface LeaveHeaderProps {
  openLeaveRequestDialog: () => void;
  isLoading: boolean;
  leaveRequests: any[];
}

export function LeaveHeader({ openLeaveRequestDialog, isLoading, leaveRequests }: LeaveHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des congés</h1>
        <p className="text-muted-foreground mt-1">Visualisez et gérez vos demandes de congés</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="default" 
          size="lg" 
          className="text-base px-6 py-5 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-blue-600 hover:bg-blue-700 text-white"
          onClick={openLeaveRequestDialog}
        >
          <Calendar className="mr-2 h-5 w-5" />
          Nouvelle Demande
        </Button>
        <ExportLeaveButton 
          data={leaveRequests} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
