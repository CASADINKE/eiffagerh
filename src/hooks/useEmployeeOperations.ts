
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
  // UI-only fields (not stored in database)
  categorie?: string;
  salaire_base?: string;
  sursalaire?: string;
  prime_deplacement?: string;
  commentaire?: string;
}

export const useEmployeeOperations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createEmployee = async (employeeData: EmployeeFormData) => {
    setIsLoading(true);
    try {
      // Extract fields that exist in the database
      const { categorie, salaire_base, sursalaire, prime_deplacement, commentaire, ...existingFields } = employeeData;
      
      const formattedData = {
        ...existingFields,
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

  const deleteEmployee = async (employeeId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('listes_employées')
        .delete()
        .eq('id', employeeId);

      if (error) {
        console.error("Error deleting employee:", error);
        toast.error(`Erreur: ${error.message}`);
        throw error;
      }

      return true;
    } catch (err: any) {
      console.error("Exception when deleting employee:", err);
      toast.error(`Erreur: ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (employeeId: string, employeeData: Partial<EmployeeFormData>) => {
    setIsLoading(true);
    try {
      console.log("Updating employee with ID:", employeeId);
      console.log("Update data:", employeeData);
      
      // Extract fields that exist in the database
      const { categorie, salaire_base, sursalaire, prime_deplacement, commentaire, ...existingFields } = employeeData;
      
      const formattedData: any = { ...existingFields };
      if (formattedData.date_naissance) {
        formattedData.date_naissance = formattedData.date_naissance instanceof Date 
          ? formattedData.date_naissance.toISOString().split('T')[0]
          : formattedData.date_naissance;
      }

      console.log("Formatted data for update:", formattedData);

      const { data, error } = await supabase
        .from('listes_employées')
        .update(formattedData)
        .eq('id', employeeId)
        .select();

      if (error) {
        console.error("Error updating employee:", error);
        toast.error(`Erreur: ${error.message}`);
        throw error;
      }

      toast.success("Employé mis à jour avec succès!");
      return data[0];
    } catch (err: any) {
      console.error("Exception when updating employee:", err);
      toast.error(`Erreur: ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMultipleEmployees = async (employeeIds: string[]) => {
    if (employeeIds.length === 0) {
      toast.error("Aucun employé sélectionné");
      return false;
    }
    
    setIsLoading(true);
    try {
      console.log("Suppression de plusieurs employés:", employeeIds);
      
      const { error } = await supabase
        .from('listes_employées')
        .delete()
        .in('id', employeeIds);

      if (error) {
        console.error("Erreur lors de la suppression de plusieurs employés:", error);
        toast.error(`Erreur: ${error.message}`);
        return false;
      }

      toast.success(`${employeeIds.length} employé(s) supprimé(s) avec succès!`);
      return true;
    } catch (err: any) {
      console.error("Exception lors de la suppression de plusieurs employés:", err);
      toast.error(`Erreur: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentEmployees = async (limit = 10) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('listes_employées')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching recent employees:", error);
        toast.error(`Erreur: ${error.message}`);
        return [];
      }

      return data;
    } catch (err: any) {
      console.error("Exception when fetching recent employees:", err);
      toast.error(`Erreur: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeById = async (employeeId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('listes_employées')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (error) {
        console.error("Error fetching employee:", error);
        toast.error(`Erreur: ${error.message}`);
        return null;
      }

      // Add UI-only properties that don't exist in the database
      return {
        ...data,
        categorie: data.categorie || "a", // Default value
        salaire_base: data.salaire_base || "",
        sursalaire: data.sursalaire || "",
        prime_deplacement: data.prime_deplacement || "",
        commentaire: data.commentaire || ""
      };
    } catch (err: any) {
      console.error("Exception when fetching employee:", err);
      toast.error(`Erreur: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createEmployee,
    fetchEmployees,
    deleteEmployee,
    updateEmployee,
    deleteMultipleEmployees,
    fetchRecentEmployees,
    fetchEmployeeById,
    isLoading
  };
};
