
import { Employee } from "@/hooks/useEmployees";

export interface EmployeeStatsResult {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  terminatedEmployees: number;
  departmentDistribution: Record<string, number>;
}

export const calculateEmployeeStats = (employees: Employee[]): EmployeeStatsResult => {
  const stats: EmployeeStatsResult = {
    totalEmployees: employees.length,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    terminatedEmployees: 0,
    departmentDistribution: {}
  };

  employees.forEach(employee => {
    // Compter par statut
    if (employee.status === 'active') {
      stats.activeEmployees++;
    } else if (employee.status === 'on-leave') {
      stats.onLeaveEmployees++;
    } else if (employee.status === 'terminated') {
      stats.terminatedEmployees++;
    }

    // Distribution par département
    if (employee.department) {
      if (!stats.departmentDistribution[employee.department]) {
        stats.departmentDistribution[employee.department] = 0;
      }
      stats.departmentDistribution[employee.department]++;
    }
  });

  return stats;
};
