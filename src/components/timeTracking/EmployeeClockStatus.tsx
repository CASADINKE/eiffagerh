
import { UserCheck, UserX, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeEntry, calculateDuration } from "@/hooks/useTimeEntries";
import { EmployeeUI } from "@/types/employee";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useClockInMutation, useClockOutMutation, getActiveTimeEntry } from "@/hooks/useTimeEntries";

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
  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  if (isLoading) {
    return <div className="p-4 text-center">Chargement des données...</div>;
  }

  // Get today's date in YYYY-MM-DD format for filtering
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Find all employees who have clocked in today and their latest entries
  const todaysEntries = timeEntries.filter(entry => entry.date === today);
  
  // Create a map of employee IDs to their latest entry for today
  const latestEntryMap = new Map<string, TimeEntry>();
  todaysEntries.forEach(entry => {
    const existingEntry = latestEntryMap.get(entry.employee_id);
    // Only keep the latest entry based on clock_in time
    if (!existingEntry || new Date(entry.clock_in) > new Date(existingEntry.clock_in)) {
      latestEntryMap.set(entry.employee_id, entry);
    }
  });
  
  const clockedInEmployeeIds = new Set(latestEntryMap.keys());

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

  // Format time to HH:MM format
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: fr });
  };

  const handleClockIn = (employeeId: string) => {
    clockInMutation.mutate({ employeeId });
  };

  const handleClockOut = (entryId: string) => {
    clockOutMutation.mutate(entryId);
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
              {clockedInEmployees.map(employee => {
                const entry = latestEntryMap.get(employee.id);
                const clockInTime = entry ? formatTime(entry.clock_in) : "--:--";
                const clockOutTime = entry && entry.clock_out ? formatTime(entry.clock_out) : null;
                const duration = entry ? calculateDuration(entry.clock_in, entry.clock_out, entry.break_time) : "--";
                const isActive = entry && !entry.clock_out;
                
                return (
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
                    <div className="flex-1">
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.matricule} • {employee.position}</p>
                    </div>
                    <div className="ml-2 flex flex-col items-end">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-sm">{clockInTime}</span>
                        {clockOutTime && <span className="text-sm ml-1">- {clockOutTime}</span>}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`h-2 w-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                        <span className="text-xs">
                          {isActive ? "En cours" : `Durée: ${duration}`}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      {isActive ? (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleClockOut(entry.id)}
                        >
                          Sortie
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                        >
                          Terminé
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
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
                  <div className="flex-1">
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.matricule} • {employee.position}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    <span className="text-sm">Non pointé</span>
                  </div>
                  <div className="ml-3">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleClockIn(employee.id)}
                    >
                      Entrée
                    </Button>
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
