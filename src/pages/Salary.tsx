
import { useState } from "react";
import { Download, Filter, DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatCard from "@/components/dashboard/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Données de salaires simulées
const salaryData = [
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
const departmentSalaryData = [
  { name: "Ingénierie", value: 800000 },
  { name: "RH", value: 850000 },
  { name: "Produit", value: 950000 },
  { name: "Design", value: 700000 },
  { name: "Marketing", value: 650000 },
];

// Dépenses salariales par mois
const salaryByMonthData = [
  { name: "Jan", value: 4200000 },
  { name: "Fév", value: 4250000 },
  { name: "Mar", value: 4300000 },
  { name: "Avr", value: 4350000 },
  { name: "Mai", value: 4400000 },
  { name: "Juin", value: 4450000 },
  { name: "Juil", value: 4500000 },
  { name: "Août", value: 4550000 },
];

// Couleurs du graphique circulaire
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Salary = () => {
  const [departmentFilter, setDepartmentFilter] = useState("all");
  
  const filteredData = salaryData.filter(
    item => departmentFilter === "all" || item.department === departmentFilter
  );
  
  const departments = [...new Set(salaryData.map(item => item.department))];
  
  // Calculer les dépenses salariales totales
  const totalSalaryExpense = salaryData.reduce((sum, item) => sum + item.totalSalary, 0);
  const averageSalary = totalSalaryExpense / salaryData.length;
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Gestion des salaires</h1>
          <p className="text-muted-foreground">Suivez et gérez les salaires des employés et la paie</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            <span>Exporter le rapport</span>
          </Button>
          <Button>Lancer la paie</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Dépense salariale totale"
          value={`${totalSalaryExpense.toLocaleString()} FCFA`}
          icon={<DollarSign />}
          trend={{ value: 3.2, positive: true }}
        />
        <StatCard
          title="Salaire moyen"
          value={`${averageSalary.toLocaleString()} FCFA`}
          icon={<TrendingUp />}
          trend={{ value: 1.5, positive: true }}
        />
        <StatCard
          title="Prochaine date de paie"
          value="30 Sep, 2023"
          icon={<Calendar />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Salaire par département</h2>
            <p className="text-sm text-muted-foreground">Salaire moyen par département</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentSalaryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                  formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Salaire moyen']}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Salaire moyen" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Dépenses salariales mensuelles</h2>
            <p className="text-sm text-muted-foreground">Dépenses salariales totales par mois</p>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentSalaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentSalaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                  formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Salaire moyen']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card className="mb-8">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-lg font-semibold">Salaires des employés</h2>
          <div className="w-full sm:w-auto">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Département</TableHead>
                <TableHead className="text-right">Salaire de base</TableHead>
                <TableHead className="text-right">Prime</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Dernier paiement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.employee}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell className="text-right">{item.baseSalary.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-right">{item.bonus.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-right font-medium">{item.totalSalary.toLocaleString()} FCFA</TableCell>
                  <TableCell>{new Date(item.lastPayment).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Modifier le salaire</DropdownMenuItem>
                        <DropdownMenuItem>Historique des salaires</DropdownMenuItem>
                        <DropdownMenuItem>Générer la fiche de paie</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Salary;
