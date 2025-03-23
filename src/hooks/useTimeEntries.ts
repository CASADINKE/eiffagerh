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

// Define a type for the profile data returned from Supabase
interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  departments?: {
    name: string | null;
  } | null;
}

// Fetch all time entries with employee details
export const fetchTimeEntries = async (): Promise<TimeEntry[]> => {
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

  // Process and format the data
  return data.map((entry) => {
    // Create an empty profile object if profiles is null
    const profileData = entry.profiles as ProfileData | null;
    
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

// Clock in an employee
export const clockInEmployee = async (employeeId: string, notes?: string): Promise<TimeEntry> => {
  const { data, error } = await supabase
    .from("time_entries")
    .insert({
      employee_id: employeeId,
      notes
    })
    .select()
    .single();

  if (error) {
    console.error("Error clocking in employee:", error);
    throw new Error(`Error clocking in employee: ${error.message}`);
  }

  return data;
};

// Clock out an employee (update existing time entry)
export const clockOutEmployee = async (entryId: string): Promise<TimeEntry> => {
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

  return data;
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
      
      // Filter by employee if specified
      if (employeeFilter && employeeFilter !== "all") {
        return entries.filter(entry => entry.employee_id === employeeFilter);
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
