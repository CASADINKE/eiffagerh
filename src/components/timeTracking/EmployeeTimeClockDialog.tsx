
import { useState } from "react";
import { Clock, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEmployees } from "@/hooks/useEmployees";
import { useTimeEntries, useClockInMutation, useClockOutMutation, getActiveTimeEntry } from "@/hooks/useTimeEntries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface EmployeeTimeClockDialogProps {
  className?: string;
}

export function EmployeeTimeClockDialog({ className }: EmployeeTimeClockDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch employees data
  const { data: employees, isLoading: employeesLoading, isError: employeesError } = useEmployees();
  
  // Fetch time entries to know which employees are already clocked in
  const { data: timeEntries = [], isLoading: entriesLoading } = useTimeEntries();
  
  // Mutations for clock in/out
  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();
  
  // Loading state combines both employees and entries loading
  const isLoading = employeesLoading || entriesLoading;
  
  // Filter employees based on search query
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleClockInOut = (employeeId: string, name: string) => {
    // Check if employee is already clocked in
    const activeEntry = getActiveTimeEntry(timeEntries, employeeId);
    
    if (activeEntry) {
      // Clock out
      clockOutMutation.mutate(activeEntry.id);
    } else {
      // Clock in
      clockInMutation.mutate({ employeeId });
    }
    
    setOpen(false);
  };
  
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Clock size={16} />
          <span>Pointer entrée/sortie</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pointer entrée/sortie</DialogTitle>
          <DialogDescription>
            Sélectionnez un employé pour enregistrer son pointage.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Chargement des employés...</p>
          </div>
        ) : employeesError ? (
          <div className="py-8 text-center text-destructive">
            <p>Une erreur est survenue lors du chargement des employés.</p>
            <p className="text-sm text-muted-foreground mt-2">Veuillez réessayer ultérieurement.</p>
          </div>
        ) : filteredEmployees && filteredEmployees.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Département</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => {
                // Check if employee is currently clocked in
                const activeEntry = getActiveTimeEntry(timeEntries, employee.id);
                const isActive = !!activeEntry;
                
                return (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {employee.avatar ? (
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                          ) : (
                            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        <span>{employee.name}</span>
                        {isActive && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={isActive ? "destructive" : "secondary"}
                        size="sm"
                        onClick={() => handleClockInOut(employee.id, employee.name)}
                      >
                        <Clock size={14} />
                        <span>{isActive ? "Pointer sortie" : "Pointer entrée"}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "Aucun employé trouvé pour votre recherche." : "Aucun employé disponible."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
