
import { Users, Calendar, DollarSign, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const chartData = [
  { name: "Jan", attendance: 92, leave: 8 },
  { name: "Feb", attendance: 90, leave: 10 },
  { name: "Mar", attendance: 94, leave: 6 },
  { name: "Apr", attendance: 88, leave: 12 },
  { name: "May", attendance: 96, leave: 4 },
  { name: "Jun", attendance: 91, leave: 9 },
];

const salaryData = [
  { name: "Engineering", value: 65000 },
  { name: "Marketing", value: 50000 },
  { name: "Sales", value: 55000 },
  { name: "HR", value: 45000 },
  { name: "Finance", value: 60000 },
];

const Dashboard = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value="128"
          icon={<Users />}
          trend={{ value: 4.5, positive: true }}
        />
        <StatCard
          title="Leave Requests"
          value="8"
          icon={<Calendar />}
          trend={{ value: 1.8, positive: false }}
        />
        <StatCard
          title="Total Salary"
          value="$245,500"
          icon={<DollarSign />}
          trend={{ value: 2.3, positive: true }}
        />
        <StatCard
          title="Avg. Work Hours"
          value="8.2h"
          icon={<Clock />}
          trend={{ value: 0.5, positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Attendance Overview</h2>
            <p className="text-sm text-muted-foreground">Daily attendance vs leave records</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorLeave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorAttendance)"
                />
                <Area
                  type="monotone"
                  dataKey="leave"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorLeave)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Salary Distribution</h2>
            <p className="text-sm text-muted-foreground">Average salary by department</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <p className="text-sm text-muted-foreground">Latest actions in the system</p>
          </div>
          <ul className="space-y-4">
            {[
              { id: 1, action: "New employee added", user: "Admin", time: "2 hours ago" },
              { id: 2, action: "Leave request approved", user: "Manager", time: "4 hours ago" },
              { id: 3, action: "Salary updated for development team", user: "HR Manager", time: "Yesterday" },
              { id: 4, action: "Time tracking report generated", user: "Admin", time: "Yesterday" },
              { id: 5, action: "New role added to the system", user: "System Admin", time: "2 days ago" },
            ].map((activity) => (
              <li key={activity.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">By {activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
