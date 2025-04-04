
import { EmployeeUI } from "@/types/employee";

// Define the TimeEntry interface
export interface TimeEntry {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out: string | null;
  break_time: number;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee?: EmployeeUI;
}

// Time entry with employee details
export interface TimeEntryWithEmployee extends TimeEntry {
  employee: EmployeeUI;
}

// Define the InsertTimeEntryParams interface
export interface InsertTimeEntryParams {
  p_id: string;
  p_employee_id: string;
  p_notes: string | null;
  p_date: string;
  p_clock_in: string;
}
