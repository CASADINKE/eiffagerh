
// Fix the SQL connection issues
import { supabase } from "@/integrations/supabase/client";
import { TimeEntry, TimeEntryWithEmployee } from "./types";

// Helper function to format employee data from DB to UI format
const formatEmployeeData = (employee: any) => {
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
const mapTimeEntryWithEmployee = (entry: any): TimeEntryWithEmployee | null => {
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

// Get all time entries with employee details
export const getTimeEntriesWithEmployees = async (): Promise<TimeEntryWithEmployee[]> => {
  try {
    // Update the query to correctly reference the listes_employées table
    const { data, error } = await supabase
      .from("time_entries")
      .select(`
        *,
        employee:employee_id(*)
      `)
      .order("date", { ascending: false });

    if (error) throw error;

    // Filter out entries that don't have valid employee data
    const validEntries = data
      .filter(entry => entry.employee)
      .map(entry => mapTimeEntryWithEmployee(entry))
      .filter(Boolean) as TimeEntryWithEmployee[];

    return validEntries;
  } catch (error) {
    console.error("Error in getTimeEntriesWithEmployees:", error);
    throw error;
  }
};

// Export a function with the name that's being imported elsewhere
export const fetchTimeEntries = getTimeEntriesWithEmployees;

// Get time entries for a specific employee
export const getEmployeeTimeEntries = async (employeeId: string): Promise<TimeEntryWithEmployee[]> => {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .select(`
        *,
        employee:employee_id(*)
      `)
      .eq("employee_id", employeeId)
      .order("date", { ascending: false });

    if (error) throw error;

    // Filter out entries that don't have valid employee data
    const validEntries = data
      .filter(entry => entry.employee)
      .map(entry => mapTimeEntryWithEmployee(entry))
      .filter(Boolean) as TimeEntryWithEmployee[];

    return validEntries;
  } catch (error) {
    console.error("Error in getEmployeeTimeEntries:", error);
    throw error;
  }
};

// Get a specific time entry
export const getTimeEntryById = async (id: string): Promise<TimeEntryWithEmployee | null> => {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .select(`
        *,
        employee:employee_id(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    
    return mapTimeEntryWithEmployee(data);
  } catch (error) {
    console.error("Error in getTimeEntryById:", error);
    throw error;
  }
};

// Clock in an employee
export const clockInEmployee = async (employeeId: string, notes: string = ""): Promise<TimeEntryWithEmployee | null> => {
  try {
    const timeEntry = {
      employee_id: employeeId,
      date: new Date().toISOString().split('T')[0],
      clock_in: new Date().toISOString(),
      notes
    };

    const { data, error } = await supabase
      .from("time_entries")
      .insert([timeEntry])
      .select(`
        *,
        employee:employee_id(*)
      `)
      .single();

    if (error) throw error;
    
    return mapTimeEntryWithEmployee(data);
  } catch (error) {
    console.error("Error in clockInEmployee:", error);
    throw error;
  }
};

// Clock out an employee
export const clockOutEmployee = async (id: string, breakTime: number = 0): Promise<TimeEntryWithEmployee | null> => {
  try {
    const updates = {
      clock_out: new Date().toISOString(),
      break_time: breakTime
    };

    const { data, error } = await supabase
      .from("time_entries")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        employee:employee_id(*)
      `)
      .single();

    if (error) throw error;
    
    return mapTimeEntryWithEmployee(data);
  } catch (error) {
    console.error("Error in clockOutEmployee:", error);
    throw error;
  }
};

// Update a time entry
export const updateTimeEntry = async (id: string, updates: Partial<TimeEntry>): Promise<TimeEntryWithEmployee | null> => {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        employee:employee_id(*)
      `)
      .single();

    if (error) throw error;
    
    return mapTimeEntryWithEmployee(data);
  } catch (error) {
    console.error("Error in updateTimeEntry:", error);
    throw error;
  }
};

// Delete a time entry
export const deleteTimeEntry = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("time_entries")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error in deleteTimeEntry:", error);
    throw error;
  }
};
