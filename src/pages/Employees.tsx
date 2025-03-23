
import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeCard from "@/components/employees/EmployeeCard";
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

// Mock employee data
const employeesData = [
  {
    id: "1",
    name: "Alex Johnson",
    position: "Frontend Developer",
    department: "Engineering",
    email: "alex.johnson@company.com",
    phone: "+1 234 567 890",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Williams",
    position: "HR Manager",
    department: "Human Resources",
    email: "sarah.williams@company.com",
    phone: "+1 234 567 891",
    status: "active",
  },
  {
    id: "3",
    name: "Michael Brown",
    position: "Product Manager",
    department: "Product",
    email: "michael.brown@company.com",
    phone: "+1 234 567 892",
    status: "on-leave",
  },
  {
    id: "4",
    name: "Emily Davis",
    position: "UI/UX Designer",
    department: "Design",
    email: "emily.davis@company.com",
    phone: "+1 234 567 893",
    status: "active",
  },
  {
    id: "5",
    name: "Daniel Wilson",
    position: "Backend Developer",
    department: "Engineering",
    email: "daniel.wilson@company.com",
    phone: "+1 234 567 894",
    status: "active",
  },
  {
    id: "6",
    name: "Olivia Taylor",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "olivia.taylor@company.com",
    phone: "+1 234 567 895",
    status: "terminated",
  },
  {
    id: "7",
    name: "James Martinez",
    position: "DevOps Engineer",
    department: "Engineering",
    email: "james.martinez@company.com",
    phone: "+1 234 567 896",
    status: "active",
  },
  {
    id: "8",
    name: "Sophia Anderson",
    position: "Content Writer",
    department: "Marketing",
    email: "sophia.anderson@company.com",
    phone: "+1 234 567 897",
    status: "active",
  },
] as const;

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(employeesData.map(emp => emp.department))];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Employees</h1>
          <p className="text-muted-foreground">Manage your employee records and information</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          <span>Add Employee</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            type="search" 
            placeholder="Search employees..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Department</h4>
                <Select 
                  value={departmentFilter} 
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
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
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <p className="text-muted-foreground">No employees found matching the search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
