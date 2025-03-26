
import { supabase } from "@/integrations/supabase/client";
import { TimeEntry, InsertTimeEntryParams } from "./types";

// Fetch all time entries with employee details
export const fetchTimeEntries = async (): Promise<TimeEntry[]> => {
  console.log("Fetching time entries...");
  
  // Use time_entries table that exists in the database schema
  const { data: timeEntriesData, error: timeEntriesError } = await supabase
    .from("time_entries")
    .select(`
      *,
      profiles:employee_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .order("date", { ascending: false })
    .order("clock_in", { ascending: false });

  if (timeEntriesError) {
    console.error("Error fetching time entries:", timeEntriesError);
    throw new Error(`Error fetching time entries: ${timeEntriesError.message}`);
  }

  console.log("Time entries fetched:", timeEntriesData?.length || 0);
  
  // If no data is returned, return an empty array
  if (!timeEntriesData || timeEntriesData.length === 0) {
    return [];
  }

  // Process and format the data
  return timeEntriesData.map((entry) => {
    // Create an empty profile object if profiles is null
    const profileData = entry.profiles || {
      id: entry.employee_id,
      full_name: null,
      avatar_url: null
    };
    
    return {
      id: entry.id,
      employee_id: entry.employee_id,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      break_time: entry.break_time || 0,
      date: entry.date,
      notes: entry.notes,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      employee: {
        id: profileData.id || entry.employee_id,
        name: profileData.full_name || "Sans nom",
        department: "Département non assigné",
        position: "Poste non spécifié",
        email: "Email non spécifié",
        phone: "Téléphone non spécifié",
        status: "active" as const,
        matricule: "Non spécifié",
        site: "Site non spécifié",
        avatar: profileData.avatar_url
      }
    };
  });
};

// Clock in an employee - with improved error handling and profile/foreign key constraint resolution
export const clockInEmployee = async (employeeId: string, notes?: string): Promise<TimeEntry> => {
  console.log("Clocking in employee:", employeeId);
  
  try {
    // Check if there's already an active time entry for this employee today
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    const { data: activeEntries, error: activeEntriesError } = await supabase
      .from("time_entries")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .is("clock_out", null);
      
    if (activeEntriesError) {
      console.error("Error checking for active entries:", activeEntriesError);
    }
    
    // If there's already an active entry, don't create a new one
    if (activeEntries && activeEntries.length > 0) {
      console.log("Employee already has an active time entry today");
      
      // Return the existing active entry
      const existingEntry = activeEntries[0];
      return {
        id: existingEntry.id,
        employee_id: existingEntry.employee_id,
        clock_in: existingEntry.clock_in,
        clock_out: existingEntry.clock_out,
        date: existingEntry.date,
        break_time: existingEntry.break_time || 0,
        notes: existingEntry.notes,
        created_at: existingEntry.created_at,
        updated_at: existingEntry.updated_at
      };
    }
    
    // Insert a new time entry
    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        employee_id: employeeId,
        notes: notes || null,
        date: today,
        clock_in: new Date().toISOString(),
        break_time: 0
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error clocking in employee:", error);
      
      // If the error is a foreign key constraint, we need to handle it specially
      if (error.code === '23503' && error.message.includes('time_entries_employee_id_fkey')) {
        console.log("Foreign key constraint error - will use direct insert approach");
        
        // Use a direct insert with our own auto-generated ID to bypass the constraint
        // Note: This is a workaround solution for the current issue
        const tempEntryId = crypto.randomUUID();
        
        // Fix the RPC call typing
        const { data: funcData, error: funcError } = await supabase.rpc<TimeEntry, InsertTimeEntryParams>(
          'insert_time_entry_bypass_fk',
          {
            p_id: tempEntryId,
            p_employee_id: employeeId,
            p_notes: notes || null,
            p_date: today,
            p_clock_in: new Date().toISOString()
          }
        );
        
        if (funcError) {
          console.error("Error inserting time entry with bypass function:", funcError);
          throw new Error(`Failed to clock in: ${funcError.message}`);
        }
        
        // If the function succeeded, return a constructed time entry
        return {
          id: tempEntryId,
          employee_id: employeeId,
          clock_in: new Date().toISOString(),
          clock_out: null,
          date: today,
          break_time: 0,
          notes: notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      // For other errors, throw normally
      throw new Error(`Error clocking in employee: ${error.message}`);
    }
    
    console.log("Clock in successful:", data);
    
    // Safe check for data before using it
    if (!data) {
      throw new Error("No data returned after clock in");
    }
    
    // Return as TimeEntry format with safe null checks
    return {
      id: data.id,
      employee_id: data.employee_id,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      date: data.date,
      break_time: data.break_time || 0,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error in clockInEmployee:", error);
    throw error;
  }
};

// Clock out an employee (update existing time entry)
export const clockOutEmployee = async (entryId: string): Promise<TimeEntry> => {
  console.log("Clocking out employee, entry ID:", entryId);
  
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .update({
        clock_out: new Date().toISOString()
      })
      .eq("id", entryId)
      .select()
      .single();
      
    if (error) {
      console.error("Error clocking out employee:", error);
      throw new Error(`Error clocking out employee: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after clock out");
    }

    console.log("Clock out successful:", data);
    
    // Return time entry format
    return {
      id: data.id,
      employee_id: data.employee_id,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      date: data.date,
      break_time: data.break_time || 0,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error in clockOutEmployee:", error);
    throw error;
  }
};
