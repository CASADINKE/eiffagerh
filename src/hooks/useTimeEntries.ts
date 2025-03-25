import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "./useEmployees";
import { EmployeeUI, mapEmployeeToUI } from "@/types/employee";
import { toast } from "sonner";

export interface TimeEntry {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out: string | null;
  break_time: number;
  date: string;
  notes: string | null;
  employee?: EmployeeUI;
}

// Fetch all time entries with employee details
export const fetchTimeEntries = async (): Promise<TimeEntry[]> => {
  console.log("Fetching time entries...");
  
  // Try to fetch from time_entries first
  let { data: timeEntriesData, error: timeEntriesError } = await supabase
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

  // If error or no data, try employee_pointage as fallback
  if (timeEntriesError || !timeEntriesData || timeEntriesData.length === 0) {
    console.log("Falling back to employee_pointage table");
    const { data: pointageData, error: pointageError } = await supabase
      .from("employee_pointage")
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
      
    if (pointageError) {
      console.error("Error fetching from both tables:", pointageError);
      throw new Error(`Error fetching time entries: ${pointageError.message}`);
    }
    
    // Transform employee_pointage data to match TimeEntry interface
    timeEntriesData = (pointageData || []).map(entry => ({
      id: entry.id,
      employee_id: entry.employee_id,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      break_time: 0,
      date: entry.date,
      notes: entry.notes,
      profiles: entry.profiles
    }));
  }

  console.log("Time entries fetched:", timeEntriesData?.length || 0);
  
  // If aucune donnée n'est retournée, on retourne un tableau vide
  if (!timeEntriesData || timeEntriesData.length === 0) {
    return [];
  }

  // Process and format the data
  return timeEntriesData.map((entry) => {
    // Create an empty profile object if profiles is null
    const profileData = entry.profiles as { id: string; full_name: string | null; avatar_url: string | null } | null;
    
    return {
      id: entry.id,
      employee_id: entry.employee_id,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      break_time: entry.break_time || 0,
      date: entry.date,
      notes: entry.notes,
      employee: {
        id: profileData?.id || entry.employee_id,
        name: profileData?.full_name || "Sans nom",
        department: "Département non assigné",
        position: "Poste non spécifié",
        email: "Email non spécifié",
        phone: "Téléphone non spécifié",
        status: "active" as const,
        matricule: "Non spécifié",
        site: "Site non spécifié",
        avatar: profileData?.avatar_url
      }
    };
  });
};

// Simplify clock in - directly use employee_pointage and skip profile check
export const clockInEmployee = async (employeeId: string, notes?: string): Promise<TimeEntry> => {
  console.log("Clocking in employee:", employeeId);
  
  try {
    // Use employee_pointage table directly (no foreign key constraint)
    const { data, error } = await supabase
      .from("employee_pointage")
      .insert({
        employee_id: employeeId,
        notes: notes || null
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error clocking in employee:", error);
      throw new Error(`Error clocking in employee: ${error.message}`);
    }
    
    console.log("Clock in successful:", data);
    
    // Convert to TimeEntry format
    return {
      id: data.id,
      employee_id: data.employee_id,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      date: data.date,
      break_time: 0,
      notes: data.notes
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
    // Try employee_pointage table first (since we're now using it for clock in)
    const { data, error } = await supabase
      .from("employee_pointage")
      .update({
        clock_out: new Date().toISOString()
      })
      .eq("id", entryId)
      .select()
      .single();
      
    if (error) {
      console.log("Entry not found in employee_pointage, trying time_entries");
      
      // If not found in employee_pointage, try time_entries
      const { data: timeEntryData, error: timeEntryError } = await supabase
        .from("time_entries")
        .update({
          clock_out: new Date().toISOString()
        })
        .eq("id", entryId)
        .select()
        .single();
        
      if (timeEntryError) {
        console.error("Error clocking out employee:", timeEntryError);
        throw new Error(`Error clocking out employee: ${timeEntryError.message}`);
      }
      
      // Return time_entries format
      return {
        id: timeEntryData.id,
        employee_id: timeEntryData.employee_id,
        clock_in: timeEntryData.clock_in,
        clock_out: timeEntryData.clock_out,
        date: timeEntryData.date,
        break_time: timeEntryData.break_time || 0,
        notes: timeEntryData.notes
      };
    }

    console.log("Clock out successful:", data);
    
    // Return employee_pointage format converted to TimeEntry
    return {
      id: data.id,
      employee_id: data.employee_id,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      date: data.date,
      break_time: 0,
      notes: data.notes
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
      toast.error(`Erreur lors du pointage d'entrée: ${error}`);
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
      toast.error(`Erreur lors du pointage de sortie: ${error}`);
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

//

