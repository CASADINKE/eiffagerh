
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, MessageCircle } from "lucide-react";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { LeaveTypeIcon } from "./LeaveTypeIcon";
import { Tables } from "@/integrations/supabase/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type LeaveRequest = Tables<"leave_requests">;

interface LeaveTableProps {
  leaveRequests: LeaveRequest[];
  isLoading: boolean;
  activeTab: string;
}

export function LeaveTable({ leaveRequests, isLoading, activeTab }: LeaveTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Filtrer les demandes de congés en fonction de l'onglet actif
  const getFilteredLeaveRequests = () => {
    if (activeTab === "all") {
      return leaveRequests;
    }
    return leaveRequests.filter(leave => leave.status === activeTab);
  };

  const filteredRequests = getFilteredLeaveRequests();

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-10">
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
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-16">
          <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <span className="text-muted-foreground">Aucune demande de congé trouvée</span>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {filteredRequests.map((leave) => (
        <TableRow key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
          <TableCell>
            <LeaveTypeIcon type={leave.type} />
          </TableCell>
          <TableCell>{formatDate(leave.start_date)}</TableCell>
          <TableCell>{formatDate(leave.end_date)}</TableCell>
          <TableCell>{leave.reason || "-"}</TableCell>
          <TableCell>
            <LeaveStatusBadge status={leave.status} />
          </TableCell>
          <TableCell>
            {leave.comments ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-slate-500">
                      <MessageCircle size={16} className="mr-1" />
                      <span className="text-xs">Commentaire</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{leave.comments}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              "-"
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
