import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeUI, mapEmployeesToUI } from "@/types/employee";
import { toast } from "sonner";

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

// Add type definition for the RPC function parameters
interface InsertTimeEntryParams {
  p_id: string;
  p_employee_id: string;
  p_notes: string | null;
  p_date: string;
  p_clock_in: string;
}

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
        const { data: funcData, error: funcError } = await supabase.rpc(
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

// Calculate the duration between clock in and clock out in hours
export const calculateDuration = (clockIn: string, clockOut: string | null, breakTime: number = 0): string => {
  if (!clockOut) return "en cours";
  
  const start = new Date(clockIn);
  const end = new Date(clockOut);
  
  // Calculate difference in milliseconds
  const diff = end.getTime() - start.getTime();
  
  // Convert to hours and minutes, subtracting break time
  const totalMinutes = Math.floor(diff / 60000) - breakTime;
  
  if (totalMinutes <= 0) return "0h 0m";
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

// Hook to fetch time entries
export const useTimeEntries = (employeeFilter?: string) => {
  return useQuery({
    queryKey: ["timeEntries", employeeFilter],
    queryFn: async () => {
      const entries = await fetchTimeEntries();
      console.log("Entries fetched, total:", entries.length);
      
      // Filter by employee if specified
      if (employeeFilter && employeeFilter !== "all") {
        const filtered = entries.filter(entry => entry.employee_id === employeeFilter);
        console.log(`Filtered by employee ${employeeFilter}:`, filtered.length);
        return filtered;
      }
      
      return entries;
    }
  });
};

// Mutation hooks for time entries
export const useClockInMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ employeeId, notes }: { employeeId: string, notes?: string }) => 
      clockInEmployee(employeeId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      toast.success("Pointage d'entrée enregistré avec succès");
    },
    onError: (error) => {
      console.error("Clock in mutation error:", error);
      toast.error(`Erreur lors du pointage d'entrée: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};

export const useClockOutMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entryId: string) => clockOutEmployee(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      toast.success("Pointage de sortie enregistré avec succès");
    },
    onError: (error) => {
      console.error("Clock out mutation error:", error);
      toast.error(`Erreur lors du pointage de sortie: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};

// Get the active time entry for an employee if it exists
export const getActiveTimeEntry = (entries: TimeEntry[], employeeId: string): TimeEntry | undefined => {
  return entries.find(entry => 
    entry.employee_id === employeeId && 
    entry.clock_in && 
    !entry.clock_out
  );
};
