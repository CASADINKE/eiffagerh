
import React from "react";
import { Calendar, Clock, FileText } from "lucide-react";

interface LeaveTypeIconProps {
  type: string;
}

export function LeaveTypeIcon({ type }: LeaveTypeIconProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "annual":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "sick":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "parental":
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
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

  return (
    <div className="flex items-center">
      {getTypeIcon(type)}
      <span className="ml-2 font-medium">{getTypeLabel(type)}</span>
    </div>
  );
}
