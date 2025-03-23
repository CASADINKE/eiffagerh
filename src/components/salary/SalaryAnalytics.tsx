
import { Card } from "@/components/ui/card";

interface DepartmentData {
  name: string;
  value: number;
}

interface SalaryAnalyticsProps {
  departmentSalaryData: DepartmentData[];
}

export function SalaryAnalytics({ departmentSalaryData }: SalaryAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
      <Card className="p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Informations sur la paie</h2>
          <p className="text-sm text-muted-foreground">Les données salariales ont été masquées</p>
        </div>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Les données salariales ne sont pas disponibles.
        </div>
      </Card>
    </div>
  );
}
