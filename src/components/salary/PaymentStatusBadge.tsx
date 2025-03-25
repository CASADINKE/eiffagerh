
import { Badge } from "@/components/ui/badge";
import { PayslipStatus } from "@/services/payslipService";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, BadgeCheck } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: PayslipStatus;
  className?: string;
}

export const PaymentStatusBadge = ({ status, className }: PaymentStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch(status) {
      case 'En attente':
        return {
          variant: 'secondary' as const,
          icon: Clock,
          text: 'En attente'
        };
      case 'Validé':
        return {
          variant: 'outline' as const,
          icon: BadgeCheck,
          text: 'Validé'
        };
      case 'Payé':
        return {
          variant: 'success' as const,
          icon: CheckCircle,
          text: 'Payé'
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: Clock,
          text: status
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        "flex items-center gap-1 font-medium",
        config.variant === 'success' && "bg-green-100 text-green-800 hover:bg-green-200",
        className
      )}
    >
      <IconComponent className="h-3.5 w-3.5" />
      <span>{config.text}</span>
    </Badge>
  );
};
