
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmployeeUI } from "@/types/employee";

export interface EmployeePointage {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  employee?: EmployeeUI;
  break_time: number; // Added to make it compatible with TimeEntry
  notes: string | null; // Added to make it compatible with TimeEntry
}

// Type for the profile data returned from Supabase
interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role?: string | null;
  department_id?: string | null;
}

// Fetch all employee pointage entries with employee details
export const fetchEmployeePointages = async (): Promise<EmployeePointage[]> => {
  const { data, error } = await supabase
    .from("employee_pointage")
    .select(`
      *,
      profiles:employee_id (
        id,
        full_name,
        avatar_url,
        role,
        department_id
      )
    `)
    .order("date", { ascending: false })
    .order("clock_in", { ascending: false });

  if (error) {
    console.error("Error fetching employee pointages:", error);
    throw new Error(`Error fetching employee pointages: ${error.message}`);
  }

  // Process and format the data
  return data.map((entry) => {
    // Fix: Properly handle the profiles data with type safety
    // Initialize with default empty values to avoid type errors
    const profileData: ProfileData = entry.profiles ? entry.profiles as ProfileData : {
      id: entry.employee_id,
      full_name: null,
      avatar_url: null
    };
    
    return {
      id: entry.id,
      employee_id: entry.employee_id,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      date: entry.date,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      break_time: 0, // Default value to make it compatible with TimeEntry
      notes: null, // Default value to make it compatible with TimeEntry
      employee: {
        id: profileData.id,
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

// Clock in an employee
export const clockInEmployee = async (employeeId: string, notes?: string): Promise<EmployeePointage> => {
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

  // Since the data returned from Supabase doesn't include a notes property by default,
  // we need to handle this by creating a complete EmployeePointage object
  return {
    id: data.id,
    employee_id: data.employee_id,
    clock_in: data.clock_in,
    clock_out: data.clock_out,
    date: data.date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    break_time: 0,
    notes: notes || null // Use the notes we passed to the function
  };
};

// Clock out an employee (update existing pointage entry)
export const clockOutEmployee = async (entryId: string): Promise<EmployeePointage> => {
  const { data, error } = await supabase
    .from("employee_pointage")
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

  // Create a complete EmployeePointage object
  return {
    id: data.id,
    employee_id: data.employee_id,
    clock_in: data.clock_in,
    clock_out: data.clock_out,
    date: data.date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    break_time: 0,
    notes: null // Since we don't have notes data when clocking out, set to null
  };
};

// Calculate the duration between clock in and clock out in hours
export const calculatePointageDuration = (clockIn: string, clockOut: string | null, breakTime: number = 0): string => {
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

// Hook to fetch employee pointages
export const useEmployeePointages = (employeeFilter?: string) => {
  return useQuery({
    queryKey: ["employeePointages", employeeFilter],
    queryFn: async () => {
      const entries = await fetchEmployeePointages();
      
      // Filter by employee if specified
      if (employeeFilter && employeeFilter !== "all") {
        return entries.filter(entry => entry.employee_id === employeeFilter);
      }
      
      return entries;
    }
  });
};

// Mutation hooks for employee pointages
export const useClockInMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ employeeId, notes }: { employeeId: string, notes?: string }) => 
      clockInEmployee(employeeId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeePointages"] });
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
      queryClient.invalidateQueries({ queryKey: ["employeePointages"] });
      toast.success("Pointage de sortie enregistré avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors du pointage de sortie: ${error}`);
    }
  });
};

// Get the active pointage entry for an employee if it exists
export const getActivePointage = (entries: EmployeePointage[], employeeId: string): EmployeePointage | undefined => {
  return entries.find(entry => 
    entry.employee_id === employeeId && 
    entry.clock_in && 
    !entry.clock_out
  );
};
