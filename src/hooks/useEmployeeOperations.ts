
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployeeFormData {
  matricule: string;
  employeur: string;
  nom: string;
  prenom: string;
  date_naissance: Date;
  poste: string;
  adresse: string;
  telephone: string;
  affectation: string;
  site: string;
}

export const useEmployeeOperations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createEmployee = async (employeeData: EmployeeFormData) => {
    setIsLoading(true);
    try {
      // Convert the Date object to ISO string for the database
      const formattedData = {
        ...employeeData,
        date_naissance: employeeData.date_naissance.toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('listes_employées')
        .insert(formattedData)
        .select();

      if (error) {
        console.error("Error inserting employee:", error);
        toast.error(`Erreur: ${error.message}`);
        return null;
      }

      toast.success("Employé ajouté avec succès!");
      return data[0];
    } catch (err: any) {
      console.error("Exception when creating employee:", err);
      toast.error(`Erreur: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('listes_employées')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching employees:", error);
        toast.error(`Erreur: ${error.message}`);
        return [];
      }

      return data;
    } catch (err: any) {
      console.error("Exception when fetching employees:", err);
      toast.error(`Erreur: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createEmployee,
    fetchEmployees,
    isLoading
  };
};
