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
    // Check if employee already has an entry for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingEntries, error: checkError } = await supabase
      .from("time_entries")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("date", today);

    if (checkError) {
      console.error("Error checking existing entries:", checkError);
      throw new Error("Erreur lors de la vérification des pointages existants");
    }

    // If the employee already has an active entry for today, prevent clocking in again
    if (existingEntries && existingEntries.length > 0) {
      const activeEntry = existingEntries.find(entry => !entry.clock_out);
      if (activeEntry) {
        throw new Error("Cet employé a déjà pointé aujourd'hui et n'a pas encore pointé sa sortie");
      }
      
      // If all entries are completed (have clock_out), don't allow creating a new entry
      if (existingEntries.every(entry => entry.clock_out)) {
        throw new Error("Cet employé a déjà effectué un cycle complet de pointage aujourd'hui");
      }
    }

    // Insert the time entry record
    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        employee_id: employeeId,
        date: today,
        clock_in: new Date().toISOString(),
        notes: notes
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error clocking in:", error);
      throw new Error("Erreur lors du pointage d'entrée");
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
    throw error; // Re-throw the error to be handled by the mutation
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
