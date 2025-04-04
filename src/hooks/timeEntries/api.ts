
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TimeEntry } from "./types";

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

    // Transform the data to match the TimeEntry type
    const formattedEntries = data ? data.map((entry: any) => ({
      id: entry.id,
      employee_id: entry.employee_id,
      date: entry.date,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      break_time: entry.break_time,
      notes: entry.notes,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      employee: entry.employee
    })) : [];

    return formattedEntries as TimeEntry[];
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

    // Insert a new time entry
    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        id: crypto.randomUUID(),
        employee_id: employeeId,
        date: formattedDate,
        clock_in: formattedTime,
        notes: notes || null
      })
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
      console.error("Error clocking in employee:", error);
      throw new Error(`Error clocking in: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after clock in");
    }

    // Transform to ensure type safety
    const formattedEntry: TimeEntry = {
      id: data.id,
      employee_id: data.employee_id,
      date: data.date,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      break_time: data.break_time,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      employee: data.employee
    };

    return formattedEntry;
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

    // Transform to ensure type safety
    const formattedEntry: TimeEntry = {
      id: data.id,
      employee_id: data.employee_id,
      date: data.date,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      break_time: data.break_time,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      employee: data.employee
    };

    return formattedEntry;
  } catch (error) {
    console.error("Unexpected error in clockOutEmployee:", error);
    throw error;
  }
};
