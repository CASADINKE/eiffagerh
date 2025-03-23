
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from "@/hooks/useEmployees";

interface TimeTrackingFiltersProps {
  dateFilter: string;
  setDateFilter: (value: string) => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  employeeFilter: string;
  setEmployeeFilter: (value: string) => void;
  employees: Employee[];
}

export const TimeTrackingFilters = ({
  dateFilter,
  setDateFilter,
  periodFilter,
  setPeriodFilter,
  employeeFilter,
  setEmployeeFilter,
  employees,
}: TimeTrackingFiltersProps) => {
  return (
    <div className="flex gap-2">
      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filtrer par date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Aujourd'hui</SelectItem>
          <SelectItem value="yesterday">Hier</SelectItem>
          <SelectItem value="all">Toutes les dates</SelectItem>
        </SelectContent>
      </Select>
      
      {dateFilter === "all" && (
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Mois courant</SelectItem>
            <SelectItem value="quarter">Trimestre</SelectItem>
            <SelectItem value="year">Année</SelectItem>
          </SelectContent>
        </Select>
      )}
      
      <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par employé" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les employés</SelectItem>
          {employees.map(employee => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
