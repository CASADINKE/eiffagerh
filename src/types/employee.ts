
export interface EmployeeUI {
  id: string;
  matricule: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'on-leave' | 'terminated';
  phone: string;
  site: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  employeur: string;
  poste: string;
  adresse: string;
  telephone: string;
  affectation: string;
  site: string;
  date_naissance: string;
  created_at: string;
  updated_at: string;
}

export const mapEmployeesToUI = (employees: Employee[]): EmployeeUI[] => {
  return employees.map(e => ({
    id: e.id,
    matricule: e.matricule,
    name: `${e.prenom} ${e.nom}`,
    email: e.adresse.includes('@') ? e.adresse : 'email@example.com',
    department: e.affectation,
    position: e.poste,
    status: 'active', // Default status, could be updated based on actual data
    phone: e.telephone,
    site: e.site
  }));
};
