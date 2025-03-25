
import { UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeEntry } from "@/hooks/useTimeEntries";
import { EmployeeUI } from "@/types/employee";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EmployeeClockStatusProps {
  employees: EmployeeUI[];
  timeEntries: TimeEntry[];
  isLoading: boolean;
}

export const EmployeeClockStatus = ({
  employees,
  timeEntries,
  isLoading,
}: EmployeeClockStatusProps) => {
  if (isLoading) {
    return <div className="p-4 text-center">Chargement des données...</div>;
  }

  // Get today's date in YYYY-MM-DD format for filtering
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Find all employees who have clocked in today
  const clockedInEmployeeIds = new Set(
    timeEntries
      .filter(entry => entry.date === today)
      .map(entry => entry.employee_id)
  );

  // Separate employees into clocked in and not clocked in
  const clockedInEmployees = employees.filter(emp => clockedInEmployeeIds.has(emp.id));
  const notClockedInEmployees = employees.filter(emp => !clockedInEmployeeIds.has(emp.id));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-green-500" />
            Employés ayant pointé aujourd'hui ({clockedInEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clockedInEmployees.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucun employé n'a pointé aujourd'hui
            </p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {clockedInEmployees.map(employee => (
                <div 
                  key={employee.id} 
                  className="flex items-center p-2 rounded-md hover:bg-muted/50"
                >
                  <Avatar className="h-8 w-8 mr-3">
                    {employee.avatar ? (
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                    ) : (
                      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.matricule} • {employee.position}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-sm">Pointé</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <UserX className="h-5 w-5 mr-2 text-red-500" />
            Employés n'ayant pas pointé aujourd'hui ({notClockedInEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notClockedInEmployees.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Tous les employés ont pointé aujourd'hui
            </p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {notClockedInEmployees.map(employee => (
                <div 
                  key={employee.id} 
                  className="flex items-center p-2 rounded-md hover:bg-muted/50"
                >
                  <Avatar className="h-8 w-8 mr-3">
                    {employee.avatar ? (
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                    ) : (
                      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.matricule} • {employee.position}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    <span className="text-sm">Non pointé</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
