
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
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
          <LeaveTable 
            leaveRequests={leaveRequests} 
            isLoading={isLoading} 
            activeTab={activeTab} 
          />
        </TableBody>
      </Table>
    </TabsContent>
  );
}
