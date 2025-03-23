
import React from "react";

interface LeaveStatusBadgeProps {
  status: string;
}

export function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium";
      case "approved":
        return "bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium";
      case "rejected":
        return "bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium";
      default:
        return "bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium";
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

  return (
    <span className={getStatusBadgeClass(status)}>
      {getStatusLabel(status)}
    </span>
  );
}
