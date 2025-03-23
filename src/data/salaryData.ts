
// Données de salaires simulées
export const salaryData = [
  {
    id: "1",
    employee: "Alex Johnson",
    position: "Développeur Frontend",
    department: "Ingénierie",
    baseSalary: 750000,
    bonus: 50000,
    totalSalary: 800000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
  {
    id: "2",
    employee: "Sarah Williams",
    position: "Responsable RH",
    department: "Ressources Humaines",
    baseSalary: 850000,
    bonus: 75000,
    totalSalary: 925000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
  {
    id: "3",
    employee: "Michael Brown",
    position: "Chef de produit",
    department: "Produit",
    baseSalary: 950000,
    bonus: 100000,
    totalSalary: 1050000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
  {
    id: "4",
    employee: "Emily Davis",
    position: "Designer UI/UX",
    department: "Design",
    baseSalary: 700000,
    bonus: 40000,
    totalSalary: 740000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
  {
    id: "5",
    employee: "Daniel Wilson",
    position: "Développeur Backend",
    department: "Ingénierie",
    baseSalary: 780000,
    bonus: 60000,
    totalSalary: 840000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
];

// Données salariales par département pour le graphique
export const departmentSalaryData = [
  { name: "Ingénierie", value: 800000 },
  { name: "RH", value: 850000 },
  { name: "Produit", value: 950000 },
  { name: "Design", value: 700000 },
  { name: "Marketing", value: 650000 },
];

// Dépenses salariales par mois
export const salaryByMonthData = [
  { name: "Jan", value: 4200000 },
  { name: "Fév", value: 4250000 },
  { name: "Mar", value: 4300000 },
  { name: "Avr", value: 4350000 },
  { name: "Mai", value: 4400000 },
  { name: "Juin", value: 4450000 },
  { name: "Juil", value: 4500000 },
  { name: "Août", value: 4550000 },
];

// Données de bulletins de paie simulées
export const paySlipData = [
  {
    id: "1",
    employee: "Alex Johnson",
    position: "Développeur Frontend",
    period: "Mai 2024",
    baseSalary: 750000,
    allowances: 50000,
    deductions: 120000,
    netSalary: 680000,
    status: "Émis",
    date: "2024-05-31",
  },
  {
    id: "2",
    employee: "Sarah Williams",
    position: "Responsable RH",
    period: "Mai 2024",
    baseSalary: 850000,
    allowances: 75000,
    deductions: 140000,
    netSalary: 785000,
    status: "Émis",
    date: "2024-05-31",
  },
  {
    id: "3",
    employee: "Seidi Suleimane",
    position: "Conducteur Engins",
    period: "Mai 2024",
    baseSalary: 450000,
    allowances: 97000,
    deductions: 89000,
    netSalary: 458000,
    status: "Émis",
    date: "2024-05-31",
  },
];
