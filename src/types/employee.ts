
import { Employee } from "@/hooks/useEmployees";

export interface EmployeeUI {
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

// Fonction pour convertir un employé du format DB au format UI
export const mapEmployeeToUI = (employee: Employee): EmployeeUI => {
  return {
    id: employee.id,
    name: `${employee.prenom} ${employee.nom}`,
    matricule: employee.matricule,
    position: employee.poste || "",
    department: employee.affectation || "",
    site: employee.site || "",
    email: employee.matricule || "", // Utilisation du matricule comme email par défaut
    phone: employee.telephone || "",
    status: "active", // Statut par défaut
    avatar: undefined
  };
};

// Fonction pour convertir une liste d'employés
export const mapEmployeesToUI = (employees: Employee[]): EmployeeUI[] => {
  return employees.map(mapEmployeeToUI);
};
