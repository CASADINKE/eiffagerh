
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

// Mock salary data
const salaryData = [
  {
    id: "1",
    employee: "Alex Johnson",
    position: "Frontend Developer",
    department: "Engineering",
    baseSalary: 75000,
    bonus: 5000,
    totalSalary: 80000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
  {
    id: "2",
    employee: "Sarah Williams",
    position: "HR Manager",
    department: "Human Resources",
    baseSalary: 85000,
    bonus: 7500,
    totalSalary: 92500,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
  {
    id: "3",
    employee: "Michael Brown",
    position: "Product Manager",
    department: "Product",
    baseSalary: 95000,
    bonus: 10000,
    totalSalary: 105000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
  {
    id: "4",
    employee: "Emily Davis",
    position: "UI/UX Designer",
    department: "Design",
    baseSalary: 70000,
    bonus: 4000,
    totalSalary: 74000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
  {
    id: "5",
    employee: "Daniel Wilson",
    position: "Backend Developer",
    department: "Engineering",
    baseSalary: 78000,
    bonus: 6000,
    totalSalary: 84000,
    paymentStatus: "paid",
    lastPayment: "2023-08-31",
  },
] as const;

// Department salary data for chart
const departmentSalaryData = [
  { name: "Engineering", value: 80000 },
  { name: "HR", value: 85000 },
  { name: "Product", value: 95000 },
  { name: "Design", value: 70000 },
  { name: "Marketing", value: 65000 },
];

// Salary expense by month
const salaryByMonthData = [
  { name: "Jan", value: 420000 },
  { name: "Feb", value: 425000 },
  { name: "Mar", value: 430000 },
  { name: "Apr", value: 435000 },
  { name: "May", value: 440000 },
  { name: "Jun", value: 445000 },
  { name: "Jul", value: 450000 },
  { name: "Aug", value: 455000 },
];

// Pie chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Salary = () => {
  const [departmentFilter, setDepartmentFilter] = useState("all");
  
  const filteredData = salaryData.filter(
    item => departmentFilter === "all" || item.department === departmentFilter
  );
  
  const departments = [...new Set(salaryData.map(item => item.department))];
  
  // Calculate total salary expense
  const totalSalaryExpense = salaryData.reduce((sum, item) => sum + item.totalSalary, 0);
  const averageSalary = totalSalaryExpense / salaryData.length;
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Salary Management</h1>
          <p className="text-muted-foreground">Track and manage employee salaries and payroll</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            <span>Export Report</span>
          </Button>
          <Button>Run Payroll</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Salary Expense"
          value={`$${totalSalaryExpense.toLocaleString()}`}
          icon={<DollarSign />}
          trend={{ value: 3.2, positive: true }}
        />
        <StatCard
          title="Average Salary"
          value={`$${averageSalary.toLocaleString()}`}
          icon={<TrendingUp />}
          trend={{ value: 1.5, positive: true }}
        />
        <StatCard
          title="Next Payroll Date"
          value="Sep 30, 2023"
          icon={<Calendar />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Salary by Department</h2>
            <p className="text-sm text-muted-foreground">Average salary by department</p>
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
                  formatter={(value) => [`$${value}`, 'Average Salary']}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Average Salary" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Monthly Salary Expense</h2>
            <p className="text-sm text-muted-foreground">Total salary expenses by month</p>
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
                  formatter={(value) => [`$${value}`, 'Average Salary']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card className="mb-8">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-lg font-semibold">Employee Salaries</h2>
          <div className="w-full sm:w-auto">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
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
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Base Salary</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.employee}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell className="text-right">${item.baseSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${item.bonus.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">${item.totalSalary.toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.lastPayment).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Salary</DropdownMenuItem>
                        <DropdownMenuItem>Salary History</DropdownMenuItem>
                        <DropdownMenuItem>Generate Payslip</DropdownMenuItem>
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
