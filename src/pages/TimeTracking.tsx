
import { useState } from "react";
import { Calendar, Clock, Download, Filter, Play, Square, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock time tracking data
const timeTrackingData = [
  {
    id: "1",
    employee: "Alex Johnson",
    position: "Frontend Developer",
    clockIn: "09:05 AM",
    clockOut: "06:10 PM",
    totalHours: "9h 5m",
    breakTime: "1h",
    workingTime: "8h 5m",
    status: "completed",
    date: "2023-09-18",
  },
  {
    id: "2",
    employee: "Sarah Williams",
    position: "HR Manager",
    clockIn: "08:55 AM",
    clockOut: "05:50 PM",
    totalHours: "8h 55m",
    breakTime: "45m",
    workingTime: "8h 10m",
    status: "completed",
    date: "2023-09-18",
  },
  {
    id: "3",
    employee: "Michael Brown",
    position: "Product Manager",
    clockIn: "09:15 AM",
    clockOut: "06:30 PM",
    totalHours: "9h 15m",
    breakTime: "1h",
    workingTime: "8h 15m",
    status: "completed",
    date: "2023-09-18",
  },
  {
    id: "4",
    employee: "Emily Davis",
    position: "UI/UX Designer",
    clockIn: "09:00 AM",
    clockOut: "--:-- --",
    totalHours: "ongoing",
    breakTime: "30m",
    workingTime: "ongoing",
    status: "active",
    date: "2023-09-19",
  },
  {
    id: "5",
    employee: "Daniel Wilson",
    position: "Backend Developer",
    clockIn: "08:45 AM",
    clockOut: "--:-- --",
    totalHours: "ongoing",
    breakTime: "1h",
    workingTime: "ongoing",
    status: "active",
    date: "2023-09-19",
  },
] as const;

// Weekly working hours data
const workingHoursData = [
  { day: "Mon", hours: 8.2 },
  { day: "Tue", hours: 8.5 },
  { day: "Wed", hours: 7.8 },
  { day: "Thu", hours: 8.3 },
  { day: "Fri", hours: 7.5 },
  { day: "Sat", hours: 4.2 },
  { day: "Sun", hours: 0 },
];

const TimeTracking = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [dateFilter, setDateFilter] = useState("today");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  
  const filteredTimeData = timeTrackingData.filter(
    record => 
      (dateFilter === "today" && record.date === "2023-09-19") ||
      (dateFilter === "yesterday" && record.date === "2023-09-18") ||
      dateFilter === "all"
  );
  
  // Time tracking metrics
  const activeEmployees = timeTrackingData.filter(
    record => record.status === "active" && record.date === "2023-09-19"
  ).length;
  
  const averageHoursToday = 
    timeTrackingData
      .filter(record => record.status === "completed" && record.date === "2023-09-19")
      .reduce((acc, curr) => {
        const hours = parseFloat(curr.workingTime.split("h")[0]);
        const minutes = parseFloat(curr.workingTime.split("h ")[1].split("m")[0]) / 60;
        return acc + hours + minutes;
      }, 0);
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Time Tracking</h1>
          <p className="text-muted-foreground">Monitor employee attendance and working hours</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            <span>Export Report</span>
          </Button>
          <div className="relative">
            <Button className="gap-2">
              <Clock size={16} />
              <span>Clock In/Out</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Active Employees"
          value={activeEmployees.toString()}
          icon={<Users />}
        />
        <StatCard
          title="Today's Average Hours"
          value={averageHoursToday ? `${averageHoursToday.toFixed(1)}h` : "N/A"}
          icon={<Clock />}
        />
        <StatCard
          title="Pending Approvals"
          value="3"
          icon={<Calendar />}
          trend={{ value: 2, positive: false }}
        />
      </div>
      
      <Card className="mb-8">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">Weekly Working Hours</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workingHoursData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                  formatter={(value) => [`${value} hours`, 'Working Time']}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between p-4 border-b border-border">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="all">All Dates</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="alex">Alex Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Williams</SelectItem>
                  <SelectItem value="michael">Michael Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="today" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Break Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTimeData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employee}</TableCell>
                      <TableCell>{record.position}</TableCell>
                      <TableCell>{record.clockIn}</TableCell>
                      <TableCell>{record.clockOut}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                      <TableCell>{record.breakTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {record.status === "active" ? (
                            <>
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              <span>Active</span>
                            </>
                          ) : (
                            <span>Completed</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {record.status === "active" ? (
                          <Button variant="outline" size="sm" className="gap-1">
                            <Square size={14} />
                            <span>Clock Out</span>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-1">
                            <Play size={14} />
                            <span>Clock In</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTimeData.length === 0 && (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">No time tracking records found for the selected filter.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="yesterday" className="m-0">
            {/* Similar content structure as "today" tab, but with yesterday's data */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Break Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTimeData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employee}</TableCell>
                      <TableCell>{record.position}</TableCell>
                      <TableCell>{record.clockIn}</TableCell>
                      <TableCell>{record.clockOut}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                      <TableCell>{record.breakTime}</TableCell>
                      <TableCell>
                        <span>Completed</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="m-0">
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">Select a date range to view historical time tracking data.</p>
              <Button>Choose Date Range</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default TimeTracking;
