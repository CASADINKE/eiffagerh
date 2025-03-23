
import { Card } from "@/components/ui/card";
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

interface DepartmentData {
  name: string;
  value: number;
}

interface SalaryAnalyticsProps {
  departmentSalaryData: DepartmentData[];
}

// Couleurs du graphique circulaire
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function SalaryAnalytics({ departmentSalaryData }: SalaryAnalyticsProps) {
  return (
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
  );
}
