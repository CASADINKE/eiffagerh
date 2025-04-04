
import { supabase } from "@/integrations/supabase/client";
import { TimeEntryWithEmployee } from "../types";
import { formatEmployeeData, mapTimeEntryWithEmployee } from "./format-utils";

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
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;
    return mapTimeEntryWithEmployee(data);
  } catch (error) {
    console.error("Error in getTimeEntryById:", error);
    throw error;
  }
};
