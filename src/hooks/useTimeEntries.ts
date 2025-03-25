
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
  
  const { data, error } = await supabase
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

  if (error) {
    console.error("Error fetching time entries:", error);
    throw new Error(`Error fetching time entries: ${error.message}`);
  }

  console.log("Time entries fetched:", data?.length || 0);
  
  // Si aucune donnée n'est retournée, on retourne un tableau vide
  if (!data || data.length === 0) {
    return [];
  }

  // Process and format the data
  return data.map((entry) => {
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

// Ensure profile exists before clocking in
const ensureProfileExists = async (employeeId: string): Promise<void> => {
  console.log("Checking if profile exists for employee:", employeeId);
  
  // Check if profile exists
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", employeeId)
    .single();
    
  if (profileError) {
    // If no profile exists, create one
    console.log("No profile found, creating one for employee:", employeeId);
    
    // Get employee data to create profile
    const { data: employeeData, error: employeeError } = await supabase
      .from("listes_employées")
      .select("*")
      .eq("id", employeeId)
      .single();
      
    if (employeeError) {
      console.error("Error getting employee data:", employeeError);
      throw new Error(`Error getting employee data: ${employeeError.message}`);
    }
    
    if (employeeData) {
      // Create profile
      const { error: createError } = await supabase
        .from("profiles")
        .insert({
          id: employeeId,
          full_name: `${employeeData.prenom} ${employeeData.nom}`,
          role: 'employee'
        });
        
      if (createError) {
        console.error("Error creating profile:", createError);
        // Continue even if there's an error creating the profile
      }
    }
  }
};

// Clock in an employee - use table without profile constraint
export const clockInEmployee = async (employeeId: string, notes?: string): Promise<TimeEntry> => {
  console.log("Clocking in employee:", employeeId);
  
  try {
    // First try to ensure profile exists
    await ensureProfileExists(employeeId);
    
    // Try to use time_entries first
    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        employee_id: employeeId,
        notes
      })
      .select()
      .single();

    if (error) {
      console.log("Error in time_entries, trying employee_pointage:", error);
      
      // If time_entries fails, try using employee_pointage
      const { data: pointageData, error: pointageError } = await supabase
        .from("employee_pointage")
        .insert({
          employee_id: employeeId,
          notes
        })
        .select()
        .single();
        
      if (pointageError) {
        console.error("Error in both tables:", pointageError);
        throw new Error(`Error clocking in employee: ${pointageError.message}`);
      }
      
      // Convert employee_pointage format to TimeEntry format
      return {
        id: pointageData.id,
        employee_id: pointageData.employee_id,
        clock_in: pointageData.clock_in,
        clock_out: pointageData.clock_out,
        date: pointageData.date,
        break_time: 0,
        notes: pointageData.notes
      };
    }

    console.log("Clock in successful:", data);
    return data;
  } catch (error) {
    console.error("Error in clockInEmployee:", error);
    throw error;
  }
};

// Clock out an employee (update existing time entry)
export const clockOutEmployee = async (entryId: string): Promise<TimeEntry> => {
  console.log("Clocking out employee, entry ID:", entryId);
  
  try {
    // Try time_entries table first
    const { data, error } = await supabase
      .from("time_entries")
      .update({
        clock_out: new Date().toISOString()
      })
      .eq("id", entryId)
      .select()
      .single();

    if (error) {
      console.log("Entry not found in time_entries, trying employee_pointage");
      
      // If not found in time_entries, try employee_pointage
      const { data: pointageData, error: pointageError } = await supabase
        .from("employee_pointage")
        .update({
          clock_out: new Date().toISOString()
        })
        .eq("id", entryId)
        .select()
        .single();
        
      if (pointageError) {
        console.error("Error clocking out employee:", pointageError);
        throw new Error(`Error clocking out employee: ${pointageError.message}`);
      }
      
      // Convert employee_pointage format to TimeEntry format
      return {
        id: pointageData.id,
        employee_id: pointageData.employee_id,
        clock_in: pointageData.clock_in,
        clock_out: pointageData.clock_out,
        date: pointageData.date,
        break_time: 0,
        notes: pointageData.notes
      };
    }

    console.log("Clock out successful:", data);
    return data;
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
