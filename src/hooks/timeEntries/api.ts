
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TimeEntry, InsertTimeEntryParams } from "./types";

// Fetch all time entries
export const fetchTimeEntries = async (): Promise<TimeEntry[]> => {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .select(`
        *,
        employee:listes_employées(
          id,
          nom,
          prenom,
          matricule,
          poste
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching time entries:", error);
      throw new Error(`Error fetching time entries: ${error.message}`);
    }

    return data as TimeEntry[] || [];
  } catch (error) {
    console.error("Unexpected error fetching time entries:", error);
    throw error;
  }
};

// Clock in an employee
export const clockInEmployee = async (employeeId: string, notes?: string): Promise<TimeEntry> => {
  try {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = now.toISOString(); // ISO format time

    // Use a stored procedure to handle the clock-in logic
    const { data, error } = await supabase.rpc<TimeEntry, {}>("insert_time_entry", {
      p_id: crypto.randomUUID(),
      p_employee_id: employeeId,
      p_notes: notes || null,
      p_date: formattedDate,
      p_clock_in: formattedTime
    });

    if (error) {
      console.error("Error clocking in employee:", error);
      throw new Error(`Error clocking in: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after clock in");
    }

    // Try to fetch the employee details for the new entry
    const { data: entryWithEmployee, error: fetchError } = await supabase
      .from("time_entries")
      .select(`
        *,
        employee:listes_employées(
          id,
          nom,
          prenom,
          matricule,
          poste
        )
      `)
      .eq("id", (data as any).id)
      .single();

    if (fetchError) {
      console.warn("Error fetching employee details after clock in:", fetchError);
      return data as TimeEntry;
    }

    return entryWithEmployee as TimeEntry;
  } catch (error) {
    console.error("Unexpected error in clockInEmployee:", error);
    throw error;
  }
};

// Clock out an employee
export const clockOutEmployee = async (entryId: string): Promise<TimeEntry> => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("time_entries")
      .update({ clock_out: now })
      .eq("id", entryId)
      .select(`
        *,
        employee:listes_employées(
          id,
          nom,
          prenom,
          matricule,
          poste
        )
      `)
      .single();

    if (error) {
      console.error("Error clocking out employee:", error);
      throw new Error(`Error clocking out: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after clock out");
    }

    return data as TimeEntry;
  } catch (error) {
    console.error("Unexpected error in clockOutEmployee:", error);
    throw error;
  }
};
