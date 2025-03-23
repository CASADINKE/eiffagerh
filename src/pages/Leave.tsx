
import { useState } from "react";
import { Plus, Calendar, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock leave request data
const leaveRequestsData = [
  {
    id: "1",
    employee: {
      name: "Alex Johnson",
      department: "Engineering",
    },
    type: "Annual",
    startDate: "2023-09-15",
    endDate: "2023-09-20",
    duration: "5 days",
    status: "pending",
    createdAt: "2023-09-01",
  },
  {
    id: "2",
    employee: {
      name: "Sarah Williams",
      department: "Human Resources",
    },
    type: "Sick",
    startDate: "2023-09-10",
    endDate: "2023-09-12",
    duration: "2 days",
    status: "approved",
    createdAt: "2023-09-05",
  },
  {
    id: "3",
    employee: {
      name: "Michael Brown",
      department: "Product",
    },
    type: "Parental",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    duration: "30 days",
    status: "approved",
    createdAt: "2023-08-15",
  },
  {
    id: "4",
    employee: {
      name: "Emily Davis",
      department: "Design",
    },
    type: "Annual",
    startDate: "2023-09-25",
    endDate: "2023-09-29",
    duration: "5 days",
    status: "pending",
    createdAt: "2023-09-10",
  },
  {
    id: "5",
    employee: {
      name: "Daniel Wilson",
      department: "Engineering",
    },
    type: "Personal",
    startDate: "2023-09-18",
    endDate: "2023-09-19",
    duration: "2 days",
    status: "rejected",
    createdAt: "2023-09-15",
  },
] as const;

// Leave types with balances
const leaveBalances = [
  { type: "Annual", total: 20, used: 8, remaining: 12 },
  { type: "Sick", total: 10, used: 3, remaining: 7 },
  { type: "Personal", total: 5, used: 2, remaining: 3 },
  { type: "Parental", total: 90, used: 0, remaining: 90 },
];

const Leave = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Sample calendar data (employees on leave for each day of month)
  const calendarData = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    employees: Math.random() > 0.7 ? 
      [...Array(Math.floor(Math.random() * 3) + 1)].map(() => 
        leaveRequestsData[Math.floor(Math.random() * leaveRequestsData.length)].employee.name) : 
      []
  }));

  const filteredRequests = leaveRequestsData.filter(request => 
    statusFilter === "all" || request.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      default:
        return null;
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Leave Management</h1>
          <p className="text-muted-foreground">Track and manage employee leaves and absences</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          <span>Request Leave</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {leaveBalances.map((balance, index) => (
          <Card key={index} className="p-4">
            <h3 className="text-sm text-muted-foreground mb-2">{balance.type} Leave</h3>
            <div className="text-2xl font-semibold mb-2">{balance.remaining} days</div>
            <div className="flex justify-between text-xs">
              <span>Total: {balance.total}</span>
              <span>Used: {balance.used}</span>
            </div>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${(balance.used / balance.total) * 100}%` }}
              ></div>
            </div>
          </Card>
        ))}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="requests" className="gap-2">
              <span>Leave Requests</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar size={16} />
              <span>Calendar View</span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "requests" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={14} />
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Status</h4>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          {activeTab === "calendar" && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePreviousMonth} 
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm font-medium">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNextMonth} 
                className="h-8 w-8 rounded-full"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="requests" className="mt-0">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Requested On</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{request.employee.name}</div>
                          <div className="text-sm text-muted-foreground">{request.employee.department}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{request.type}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{request.duration}</div>
                          <div className="text-muted-foreground">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {request.status === "pending" && (
                              <>
                                <DropdownMenuItem>Approve</DropdownMenuItem>
                                <DropdownMenuItem>Reject</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRequests.length === 0 && (
                <div className="py-6 text-center text-muted-foreground">
                  No leave requests found matching the filter.
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <Card className="p-6">
            <div className="grid grid-cols-7 gap-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center py-2 text-sm font-medium">
                  {day}
                </div>
              ))}
              
              {/* Sample calendar grid - in a real app, this would be calculated based on the month */}
              {Array.from({ length: 42 }, (_, i) => {
                const day = i - 3; // Offset to start month on correct day
                return (
                  <div 
                    key={i} 
                    className={`
                      border border-border rounded-md min-h-[80px] p-2
                      ${day < 0 || day >= 30 ? 'bg-muted/50 text-muted-foreground/50' : ''}
                      ${day === new Date().getDate() - 1 && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? 'border-primary/50' : ''}
                    `}
                  >
                    {day >= 0 && day < 30 && (
                      <>
                        <div className="text-right text-sm mb-1">{day + 1}</div>
                        {calendarData[day]?.employees.length > 0 && (
                          <div className="space-y-1">
                            {calendarData[day].employees.slice(0, 2).map((emp, idx) => (
                              <div key={idx} className="text-xs py-0.5 px-1 bg-primary/10 rounded">
                                {emp}
                              </div>
                            ))}
                            {calendarData[day].employees.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{calendarData[day].employees.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leave;
