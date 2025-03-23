
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase
        .from("listes_employées")
        .select("*")
        .order("nom", { ascending: true });

      if (error) {
        console.error("Error fetching employees:", error);
        throw new Error(error.message);
      }

      return data as Employee[];
    },
  });
};
