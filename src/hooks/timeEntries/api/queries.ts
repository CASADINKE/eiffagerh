
import { supabase } from "@/integrations/supabase/client";
import { TimeEntryWithEmployee } from "../types";
import { formatEmployeeData, mapTimeEntryWithEmployee } from "./format-utils";

// Get all time entries with employee details
export const getTimeEntriesWithEmployees = async (): Promise<TimeEntryWithEmployee[]> => {
  try {
    // First get all time entries
    const { data: entriesData, error: entriesError } = await supabase
      .from("time_entries")
      .select("*")
      .order("date", { ascending: false });

    if (entriesError) throw entriesError;
    
    if (!entriesData || entriesData.length === 0) return [];
    
    // Get all unique employee IDs
    const employeeIds = [...new Set(entriesData.map(entry => entry.employee_id))];
    
    // Fetch all employees in one query
    const { data: employeesData, error: employeesError } = await supabase
      .from("listes_employées")
      .select("*")
      .in("id", employeeIds);
      
    if (employeesError) throw employeesError;
    
    // Create a map for quick employee lookup
    const employeeMap = new Map();
    employeesData?.forEach(emp => {
      employeeMap.set(emp.id, emp);
    });
    
    // Combine time entries with employee data
    const combinedData = entriesData.map(entry => {
      return {
        ...entry,
        employee: employeeMap.get(entry.employee_id) || null
      };
    });
    
    // Map to the correct format and filter out entries without employee data
    const validEntries = combinedData
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
    // Get entries for specific employee
    const { data: entriesData, error: entriesError } = await supabase
      .from("time_entries")
      .select("*")
      .eq("employee_id", employeeId)
      .order("date", { ascending: false });

    if (entriesError) throw entriesError;
    
    if (!entriesData || entriesData.length === 0) return [];
    
    // Fetch employee data
    const { data: employeeData, error: employeeError } = await supabase
      .from("listes_employées")
      .select("*")
      .eq("id", employeeId)
      .single();
      
    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
      return [];
    }
    
    // Combine entries with employee data
    const combinedData = entriesData.map(entry => {
      return {
        ...entry,
        employee: employeeData
      };
    });
    
    // Map to the correct format
    const validEntries = combinedData
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
    const { data: entryData, error: entryError } = await supabase
      .from("time_entries")
      .select("*")
      .eq("id", id)
      .single();

    if (entryError) throw entryError;
    if (!entryData) return null;
    
    // Fetch employee data
    const { data: employeeData, error: employeeError } = await supabase
      .from("listes_employées")
      .select("*")
      .eq("id", entryData.employee_id)
      .single();
      
    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
    }
    
    // Combine entry with employee data
    const combinedData = {
      ...entryData,
      employee: employeeData || null
    };
    
    return mapTimeEntryWithEmployee(combinedData);
  } catch (error) {
    console.error("Error in getTimeEntryById:", error);
    throw error;
  }
};
