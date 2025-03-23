
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
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border bg-card p-5 shadow-elevation-1 transition-all hover:shadow-elevation-2",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-muted-foreground text-sm font-medium">{title}</div>
        <div className="text-primary">{icon}</div>
      </div>
      
      <div className="text-2xl font-semibold mb-2">{value}</div>
      
      {trend && (
        <div className="flex items-center text-xs">
          <span className={cn(
            "inline-flex items-center",
            trend.positive ? "text-emerald-500" : "text-rose-500"
          )}>
            <span className="mr-1">
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            par rapport au mois dernier
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
