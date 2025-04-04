
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
  employer: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  matricule: string;
  employeur: string;
  nom: string;
  prenom: string;
  poste: string;
  adresse: string;
  telephone: string;
  affectation: string;
  site: string;
  date_naissance: string;
  created_at: string;
  updated_at: string;
  // UI-only fields (not in database)
  categorie?: string;
  salaire_base?: string;
  sursalaire?: string;
  prime_deplacement?: string;
  commentaire?: string;
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
    site: e.site,
    employer: e.employeur
  }));
};
