
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeUI, mapEmployeesToUI } from "@/types/employee";

export interface Employee {
  id: string;
  matricule: string;
  employeur: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  poste: string;
  adresse: string;
  telephone: string;
  affectation: string;
  site: string;
  created_at: string;
  updated_at: string;
}

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async (): Promise<Employee[]> => {
      // First check which employee IDs exist in the profiles table
      const { data: profileData, error: profilesError } = await supabase
        .from("profiles")
        .select("id");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw new Error(profilesError.message);
      }

      // Create a set of valid profile IDs for faster lookup
      const validProfileIds = new Set(profileData.map(profile => profile.id));

      // Then fetch all employees
      const { data, error } = await supabase
        .from("listes_employées")
        .select("*")
        .order("nom", { ascending: true });

      if (error) {
        console.error("Error fetching employees:", error);
        throw new Error(error.message);
      }

      // For each employee in listes_employées, check if a corresponding profile exists
      // If not, create one to ensure the foreign key constraint is satisfied
      for (const employee of data) {
        if (!validProfileIds.has(employee.id)) {
          console.log(`Creating profile for employee: ${employee.nom} ${employee.prenom}`);
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: employee.id,
              full_name: `${employee.prenom} ${employee.nom}`,
              role: 'employee'
            });

          if (insertError) {
            console.error(`Error creating profile for employee ${employee.id}:`, insertError);
            // Don't throw here, just log the error and continue
          }
        }
      }

      return data as Employee[];
    },
  });
};

// Hook qui renvoie les employés au format UI
export const useEmployeesUI = () => {
  const employeesQuery = useEmployees();
  
  return {
    ...employeesQuery,
    data: employeesQuery.data ? mapEmployeesToUI(employeesQuery.data) : undefined
  };
};
