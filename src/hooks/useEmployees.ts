
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Employee {
  id: string;
  name: string;
  matricule: string;
  position: string;
  department: string;
  site: string;
  email: string;
  phone: string;
  status: "active" | "on-leave" | "terminated";
  avatar?: string;
}

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from("listes_employées")
    .select("*")
    .order("nom", { ascending: true });

  if (error) {
    console.error("Error fetching employees:", error);
    throw new Error(`Error fetching employees: ${error.message}`);
  }

  // Transform the data structure from listes_employées to match our Employee interface
  return data.map(emp => ({
    id: emp.id,
    name: `${emp.nom} ${emp.prenom}`,
    matricule: emp.matricule,
    position: emp.poste,
    department: emp.affectation,
    site: emp.site,
    email: "non spécifié", // These fields don't exist in listes_employées
    phone: emp.telephone,
    status: "active", // Default status
    avatar: undefined
  }));
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees
  });
};
