
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type EmployeeStatus = "active" | "on-leave" | "terminated";

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  status: EmployeeStatus;
}

// Fonction pour faire correspondre les statuts de la base de données avec ceux de l'interface
const mapStatusFromDB = (dbStatus: string | null): EmployeeStatus => {
  switch (dbStatus) {
    case "actif":
      return "active";
    case "en_congé":
      return "on-leave";
    case "terminé":
      return "terminated";
    default:
      return "active";
  }
};

// Fonction pour récupérer les employés depuis Supabase
export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      avatar_url,
      department_id,
      departments (
        name
      )
    `);

  if (profilesError) {
    console.error("Erreur lors de la récupération des profils:", profilesError);
    throw new Error(`Erreur de récupération des profils: ${profilesError.message}`);
  }

  // Récupérer les données d'employés pour les profils
  const profileIds = profilesData.map(profile => profile.id);
  const { data: employeesData, error: employeesError } = await supabase
    .from("employees")
    .select(`
      id,
      position,
      contact_email,
      contact_phone,
      status
    `)
    .in("id", profileIds);

  if (employeesError) {
    console.error("Erreur lors de la récupération des employés:", employeesError);
    throw new Error(`Erreur de récupération des employés: ${employeesError.message}`);
  }

  // Combiner les données des profils et des employés
  const employees = profilesData.map(profile => {
    const employeeData = employeesData.find(employee => employee.id === profile.id) || {
      position: null,
      contact_email: null,
      contact_phone: null,
      status: "actif"
    };

    return {
      id: profile.id,
      name: profile.full_name || "Sans nom",
      position: employeeData.position || "Poste non spécifié",
      department: profile.departments?.name || "Département non assigné",
      email: employeeData.contact_email || "Email non spécifié",
      phone: employeeData.contact_phone || "Téléphone non spécifié",
      avatar: profile.avatar_url,
      status: mapStatusFromDB(employeeData.status)
    };
  });

  return employees;
};

// Hook React Query pour récupérer les employés
export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees
  });
};
