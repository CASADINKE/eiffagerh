
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

    // Process the data to ensure it matches our TimeEntry type
    const processedData = (data || []).map(entry => {
      // Format the employee data correctly
      const employeeData = entry.employee;
      
      return {
        ...entry,
        employee: employeeData ? {
          id: employeeData.id,
          nom: employeeData.nom,
          prenom: employeeData.prenom,
          matricule: employeeData.matricule,
          poste: employeeData.poste
        } : undefined
      } as TimeEntry;
    });

    return processedData;
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
    const { data: rpcData, error: rpcError } = await supabase.rpc("insert_time_entry", {
      p_id: crypto.randomUUID(),
      p_employee_id: employeeId,
      p_notes: notes || null,
      p_date: formattedDate,
      p_clock_in: formattedTime
    });

    if (rpcError) {
      console.error("Error clocking in employee:", rpcError);
      throw new Error(`Error clocking in: ${rpcError.message}`);
    }

    if (!rpcData) {
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
      .eq("id", (rpcData as any).id)
      .single();

    if (fetchError) {
      console.warn("Error fetching employee details after clock in:", fetchError);
      // If we can't fetch the employee details, return a minimal TimeEntry object
      return {
        id: (rpcData as any).id,
        employee_id: employeeId,
        clock_in: formattedTime,
        clock_out: null,
        break_time: 0,
        date: formattedDate,
        notes: notes || null,
        created_at: formattedTime,
        updated_at: formattedTime
      } as TimeEntry;
    }

    // Process the data to ensure it matches our TimeEntry type
    const employeeData = entryWithEmployee.employee;
    
    return {
      ...entryWithEmployee,
      employee: employeeData ? {
        id: employeeData.id,
        nom: employeeData.nom,
        prenom: employeeData.prenom,
        matricule: employeeData.matricule,
        poste: employeeData.poste
      } : undefined
    } as TimeEntry;
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

    // Process the data to ensure it matches our TimeEntry type
    const employeeData = data.employee;
    
    return {
      ...data,
      employee: employeeData ? {
        id: employeeData.id,
        nom: employeeData.nom,
        prenom: employeeData.prenom,
        matricule: employeeData.matricule,
        poste: employeeData.poste
      } : undefined
    } as TimeEntry;
  } catch (error) {
    console.error("Unexpected error in clockOutEmployee:", error);
    throw error;
  }
};
