
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SalaryDetail {
  id: string;
  employee_id: string;
  base_salary: number;
  contract_type: string;
  pay_grade: string | null;
  currency: string;
  payment_frequency: string;
  tax_rate: number | null;
  created_at: string;
  updated_at: string;
  employee?: {
    full_name: string;
    role: string;
  };
}

// Function to get all salary details
export const getSalaryDetails = async (): Promise<SalaryDetail[]> => {
  try {
    const { data, error } = await supabase
      .from('salary_details')
      .select(`
        *,
        employee:profiles(full_name, role)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching salary details:", error);
      toast.error("Erreur lors de la récupération des détails de salaire");
      return [];
    }
    
    return data as SalaryDetail[];
  } catch (error) {
    console.error("Error fetching salary details:", error);
    toast.error("Erreur lors de la récupération des détails de salaire");
    return [];
  }
};

// Function to get employee's salary detail
export const getEmployeeSalaryDetail = async (employeeId: string): Promise<SalaryDetail | null> => {
  try {
    const { data, error } = await supabase
      .from('salary_details')
      .select(`
        *,
        employee:profiles(full_name, role)
      `)
      .eq('employee_id', employeeId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error("Error fetching employee salary detail:", error);
        toast.error("Erreur lors de la récupération du détail de salaire");
      }
      return null;
    }
    
    return data as SalaryDetail;
  } catch (error) {
    console.error("Error fetching employee salary detail:", error);
    toast.error("Erreur lors de la récupération du détail de salaire");
    return null;
  }
};

// Function to create a salary detail
export const createSalaryDetail = async (salaryDetail: Omit<SalaryDetail, 'id' | 'created_at' | 'updated_at'>): Promise<SalaryDetail | null> => {
  try {
    const { data, error } = await supabase
      .from('salary_details')
      .insert(salaryDetail)
      .select()
      .single();

    if (error) {
      console.error("Error creating salary detail:", error);
      toast.error("Erreur lors de la création du détail de salaire");
      return null;
    }
    
    toast.success("Détail de salaire créé avec succès");
    return data as SalaryDetail;
  } catch (error) {
    console.error("Error creating salary detail:", error);
    toast.error("Erreur lors de la création du détail de salaire");
    return null;
  }
};

// Function to update a salary detail
export const updateSalaryDetail = async (id: string, salaryDetail: Partial<Omit<SalaryDetail, 'id' | 'created_at' | 'updated_at'>>): Promise<SalaryDetail | null> => {
  try {
    const { data, error } = await supabase
      .from('salary_details')
      .update(salaryDetail)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating salary detail:", error);
      toast.error("Erreur lors de la mise à jour du détail de salaire");
      return null;
    }
    
    toast.success("Détail de salaire mis à jour avec succès");
    return data as SalaryDetail;
  } catch (error) {
    console.error("Error updating salary detail:", error);
    toast.error("Erreur lors de la mise à jour du détail de salaire");
    return null;
  }
};
