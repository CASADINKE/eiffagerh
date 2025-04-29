
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  subtitle?: string;
  className?: string;
}

const StatCard = ({ title, value, icon, trend, subtitle, className }: StatCardProps) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-card-hover transform hover:-translate-y-1",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-muted-foreground text-sm font-medium">{title}</div>
        <div className="text-primary bg-primary/10 p-2 rounded-lg">{icon}</div>
      </div>
      
      <div className="text-2xl font-semibold mb-2">{value}</div>
      
      {subtitle && (
        <div className="text-xs text-muted-foreground mb-2">{subtitle}</div>
      )}
      
      {trend && (
        <div className="flex items-center text-xs">
          <span className={cn(
            "inline-flex items-center",
            trend.positive ? "text-emerald-500" : "text-rose-500"
          )}>
            <span className="mr-1">
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground font-light">
              par rapport au mois dernier
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
