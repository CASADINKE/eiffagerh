
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tables } from "@/integrations/supabase/types";
import { LeaveTable } from "./LeaveTable";

type LeaveRequest = Tables<"leave_requests">;

interface LeaveTableContainerProps {
  leaveRequests: LeaveRequest[];
  isLoading: boolean;
  activeTab: string;
}

export function LeaveTableContainer({ leaveRequests, isLoading, activeTab }: LeaveTableContainerProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-foreground/90 w-[15%]">Type</TableHead>
            <TableHead className="font-semibold text-foreground/90 w-[15%]">Date de début</TableHead>
            <TableHead className="font-semibold text-foreground/90 w-[15%]">Date de fin</TableHead>
            <TableHead className="font-semibold text-foreground/90 w-[25%]">Motif</TableHead>
            <TableHead className="font-semibold text-foreground/90 w-[15%]">Statut</TableHead>
            <TableHead className="font-semibold text-foreground/90 w-[15%]">Commentaires</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <LeaveTable 
            leaveRequests={leaveRequests} 
            isLoading={isLoading} 
            activeTab={activeTab} 
          />
        </TableBody>
      </Table>
    </div>
  );
}
