
import { EmployeeUI } from "@/types/employee";
import { supabase } from "@/integrations/supabase/client";
import { TimeEntry, TimeEntryWithEmployee } from "./types";

// Function to format a clock time with timezone correction
export const formatClockTime = (timestamp: string | null): string => {
  if (!timestamp) return "";
  // Create a date object from the timestamp
  const date = new Date(timestamp);
  // Format the time as HH:MM
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Function to calculate hours difference between two ISO timestamps
export const calculateHours = (clockIn: string, clockOut: string | null): number => {
  if (!clockOut) return 0;
  
  const startTime = new Date(clockIn).getTime();
  const endTime = new Date(clockOut).getTime();
  // Calculate the difference in milliseconds and convert to hours
  return Math.max(0, (endTime - startTime) / (1000 * 60 * 60));
};

// Format hours as decimal hours for display
export const formatHours = (hours: number): string => {
  return hours.toFixed(2);
};

// Convert break time from minutes to hours for display
export const breakMinutesToHours = (breakMinutes: number): number => {
  return breakMinutes / 60;
};

// Format a date as DD/MM/YYYY
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("fr-FR");
};

// Format a date as YYYY-MM-DD for form inputs
export const formatDateForInput = (date: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Clock in an employee
export const clockInEmployee = async (employeeId: string, notes?: string): Promise<TimeEntry | null> => {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        employee_id: employeeId,
        date: today,
        clock_in: new Date().toISOString(),
        notes: notes || null,
        break_time: 0
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    console.log("Clock in successful:", data);
    return data;
  } catch (error) {
    console.error("Error clocking in employee:", error);
    throw error;
  }
};

// Clock out an employee
export const clockOutEmployee = async (entryId: string): Promise<TimeEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .update({
        clock_out: new Date().toISOString()
      })
      .eq('id', entryId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    console.log("Clock out successful:", data);
    return data;
  } catch (error) {
    console.error("Error clocking out employee:", error);
    throw error;
  }
};

export interface TimeEntryResponse {
  id: string;
  employee_id: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
  break_time: number;
  notes: string;
  created_at: string;
  updated_at: string;
  employee: {
    id: string;
    nom: string;
    prenom: string;
    matricule: string;
    poste: string;
    affectation: string;
    telephone: string;
    site: string;
    employeur: string;
  };
}

// Transform TimeEntryResponse to TimeEntryWithEmployee
export const transformTimeEntryResponse = (entry: TimeEntryResponse): TimeEntryWithEmployee => {
  return {
    id: entry.id,
    employee_id: entry.employee_id,
    date: entry.date,
    clock_in: entry.clock_in,
    clock_out: entry.clock_out,
    break_time: entry.break_time,
    notes: entry.notes,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
    employee: {
      id: entry.employee.id,
      name: `${entry.employee.prenom} ${entry.employee.nom}`,
      department: entry.employee.affectation,
      position: entry.employee.poste,
      email: "email@example.com", // Default email
      phone: entry.employee.telephone,
      status: "active" as const,
      matricule: entry.employee.matricule,
      site: entry.employee.site,
      employer: entry.employee.employeur,
      avatar: null,
    },
  };
};

// Function to fetch all time entries
export const fetchTimeEntries = async (): Promise<TimeEntryWithEmployee[]> => {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .select(`
        *,
        employee:employee_id(
          id, 
          nom, 
          prenom, 
          matricule, 
          poste,
          affectation,
          telephone,
          site,
          employeur
        )
      `)
      .order("date", { ascending: false });

    if (error) throw error;

    if (!data) return [];

    // Transform data to the expected format
    const transformedData = data.map((entry: any) => ({
      id: entry.id,
      employee_id: entry.employee_id,
      date: entry.date,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      break_time: entry.break_time || 0,
      notes: entry.notes,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      employee: {
        id: entry.employee.id,
        name: `${entry.employee.prenom} ${entry.employee.nom}`,
        department: entry.employee.affectation,
        position: entry.employee.poste,
        email: "email@example.com", // Default email
        phone: entry.employee.telephone,
        status: "active" as const,
        matricule: entry.employee.matricule,
        site: entry.employee.site,
        employer: entry.employee.employeur,
        avatar: null,
      },
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching time entries:", error);
    throw error;
  }
};

// Function to fetch a time entry by ID
export const fetchTimeEntryById = async (
  id: string
): Promise<TimeEntryWithEmployee | null> => {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .select(`
        *,
        employee:employee_id(
          id, 
          nom, 
          prenom, 
          matricule, 
          poste,
          affectation,
          telephone,
          site,
          employeur
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      employee_id: data.employee_id,
      date: data.date,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      break_time: data.break_time || 0,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      employee: {
        id: data.employee.id,
        name: `${data.employee.prenom} ${data.employee.nom}`,
        department: data.employee.affectation,
        position: data.employee.poste,
        email: "email@example.com", // Default email
        phone: data.employee.telephone,
        status: "active" as const,
        matricule: data.employee.matricule,
        site: data.employee.site,
        employer: data.employee.employeur,
        avatar: null,
      },
    };
  } catch (error) {
    console.error("Error fetching time entry by ID:", error);
    throw error;
  }
};

// Function to create a new time entry
export const createTimeEntry = async (
  timeEntry: Omit<TimeEntry, "id" | "employee">
): Promise<TimeEntryWithEmployee | null> => {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .insert([timeEntry])
      .select(`
        *,
        employee:employee_id(
          id, 
          nom, 
          prenom, 
          matricule, 
          poste,
          affectation,
          telephone,
          site,
          employeur
        )
      `)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      employee_id: data.employee_id,
      date: data.date,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      break_time: data.break_time || 0,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      employee: {
        id: data.employee.id,
        name: `${data.employee.prenom} ${data.employee.nom}`,
        department: data.employee.affectation,
        position: data.employee.poste,
        email: "email@example.com", // Default email
        phone: data.employee.telephone,
        status: "active" as const,
        matricule: data.employee.matricule,
        site: data.employee.site,
        employer: data.employee.employeur,
        avatar: null,
      },
    };
  } catch (error) {
    console.error("Error creating time entry:", error);
    throw error;
  }
};

// Function to update an existing time entry
export const updateTimeEntry = async (
  id: string,
  updates: Partial<Omit<TimeEntry, "id" | "employee">>
): Promise<TimeEntryWithEmployee | null> => {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        employee:employee_id(
          id, 
          nom, 
          prenom, 
          matricule, 
          poste,
          affectation,
          telephone,
          site,
          employeur
        )
      `)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      employee_id: data.employee_id,
      date: data.date,
      clock_in: data.clock_in,
      clock_out: data.clock_out,
      break_time: data.break_time || 0,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      employee: {
        id: data.employee.id,
        name: `${data.employee.prenom} ${data.employee.nom}`,
        department: data.employee.affectation,
        position: data.employee.poste,
        email: "email@example.com", // Default email
        phone: data.employee.telephone,
        status: "active" as const,
        matricule: data.employee.matricule,
        site: data.employee.site,
        employer: data.employee.employeur,
        avatar: null,
      },
    };
  } catch (error) {
    console.error("Error updating time entry:", error);
    throw error;
  }
};

// Function to delete a time entry by ID
export const deleteTimeEntry = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("time_entries").delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting time entry:", error);
    throw error;
  }
};
