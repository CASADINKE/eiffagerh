
import { EmployeeUI } from "@/types/employee";
import { TimeEntryWithEmployee } from "../types";

// Helper function to format employee data from DB to UI format
export const formatEmployeeData = (employee: any): EmployeeUI | null => {
  if (!employee) return null;
  
  return {
    id: employee.id,
    name: `${employee.prenom} ${employee.nom}`,
    department: employee.affectation,
    position: employee.poste,
    email: "email@example.com", // Default email since it's not in the database
    phone: employee.telephone,
    status: "active" as const,
    matricule: employee.matricule,
    site: employee.site,
    employer: employee.employeur,
    avatar: null,
  };
};

// Helper to map DB time entry to UI time entry
export const mapTimeEntryWithEmployee = (entry: any): TimeEntryWithEmployee | null => {
  if (!entry || !entry.employee) return null;
  
  return {
    id: entry.id,
    employee_id: entry.employee_id,
    date: entry.date,
    clock_in: entry.clock_in,
    clock_out: entry.clock_out,
    break_time: entry.break_time || 0,
    notes: entry.notes || "",
    created_at: entry.created_at,
    updated_at: entry.updated_at,
    employee: formatEmployeeData(entry.employee),
  };
};
