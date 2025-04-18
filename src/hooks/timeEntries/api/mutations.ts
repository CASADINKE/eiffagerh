
import { supabase } from "@/integrations/supabase/client";
import { TimeEntry, TimeEntryWithEmployee } from "../types";
import { mapTimeEntryWithEmployee } from "./format-utils";

// Define proper types for RPC parameters
interface InsertTimeEntryBypassParams {
  p_employee_id: string;
  p_date: string;
}

export const clockInEmployee = async (
  employeeId: string,
  notes?: string
): Promise<TimeEntryWithEmployee | null> => {
  try {
    // Insert the time entry record
    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        employee_id: employeeId,
        date: new Date().toISOString().split('T')[0],
        clock_in: new Date().toISOString(),
        notes: notes
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error clocking in:", error);
      return null;
    }

    // Then fetch the employee data separately
    const { data: employeeData, error: employeeError } = await supabase
      .from("listes_employées")
      .select("*")
      .eq("id", employeeId)
      .single();
      
    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
    }

    // Create a combined object
    const combinedData = {
      ...data,
      employee: employeeData
    };

    return mapTimeEntryWithEmployee(combinedData);
  } catch (error) {
    console.error("Error clocking in employee:", error);
    return null;
  }
};

export const clockOutEmployee = async (
  entryId: string
): Promise<TimeEntryWithEmployee | null> => {
  try {
    // Update the time entry with clock out time
    const { data, error } = await supabase
      .from("time_entries")
      .update({
        clock_out: new Date().toISOString(),
      })
      .eq("id", entryId)
      .select("*")
      .single();

    if (error) {
      console.error("Error clocking out:", error);
      return null;
    }

    // Then fetch the employee data separately
    const { data: employeeData, error: employeeError } = await supabase
      .from("listes_employées")
      .select("*") 
      .eq("id", data.employee_id)
      .single();
      
    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
    }

    // Create a combined object
    const combinedData = {
      ...data,
      employee: employeeData
    };

    return mapTimeEntryWithEmployee(combinedData);
  } catch (error) {
    console.error("Error clocking out employee:", error);
    return null;
  }
};

export const insertTimeEntryBypass = async (
  employeeId: string,
  date: string
): Promise<boolean> => {
  try {
    // Create properly typed parameters
    const rpcParams: InsertTimeEntryBypassParams = {
      p_employee_id: employeeId,
      p_date: date
    };
    
    // Fix: Cast the function name as any to bypass TypeScript constraint
    const { data, error } = await (supabase.rpc as any)(
      'insert_time_entry_bypass', 
      rpcParams
    );

    if (error) {
      console.error("Error inserting time entry bypass:", error);
      return false;
    }

    console.log("Time entry bypass inserted:", data);
    return true;
  } catch (error) {
    console.error("Error in insertTimeEntryBypass:", error);
    return false;
  }
};

export const deleteTimeEntry = async (entryId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("time_entries")
      .delete()
      .eq("id", entryId);

    if (error) {
      console.error("Error deleting time entry:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting time entry:", error);
    return false;
  }
};

export const updateTimeEntry = async (
  entryId: string,
  updates: Partial<TimeEntry>
): Promise<TimeEntryWithEmployee | null> => {
  try {
    // Update the time entry record
    const { data, error } = await supabase
      .from("time_entries")
      .update(updates)
      .eq("id", entryId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating time entry:", error);
      return null;
    }

    // Then fetch the employee data separately
    const { data: employeeData, error: employeeError } = await supabase
      .from("listes_employées")
      .select("*")
      .eq("id", data.employee_id)
      .single();
      
    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
    }

    // Create a combined object
    const combinedData = {
      ...data,
      employee: employeeData
    };

    return mapTimeEntryWithEmployee(combinedData);
  } catch (error) {
    console.error("Error updating time entry:", error);
    return null;
  }
};
