import { useState } from "react";
import { Clock, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEmployeesUI } from "@/hooks/useEmployees";
import { useTimeEntries, getActiveTimeEntry } from "@/hooks/timeEntries";
import { useTimeEntriesOperations } from "@/hooks/timeEntries/useTimeEntriesOperations";
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClockIn?: (employeeId: string, notes?: string) => Promise<void>;
}

export function EmployeeTimeClockDialog({ 
  className, 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onClockIn
}: EmployeeTimeClockDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use the controlled open state if provided, otherwise use local state
  const isOpen = controlledOpen !== undefined ? controlledOpen : open;
  const setIsOpen = setControlledOpen || setOpen;
  
  // Use useEmployeesUI instead of useEmployees
  const { data: employees = [], isLoading: employeesLoading, isError: employeesError } = useEmployeesUI();
  
  // Fetch time entries to know which employees are already clocked in
  const { data: timeEntries = [], isLoading: entriesLoading } = useTimeEntries();
  
  // Time entries operations
  const { handleClockInOut, isClockingIn, isClockingOut } = useTimeEntriesOperations();
  
  // Loading state combines both employees and entries loading
  const isLoading = employeesLoading || entriesLoading;
  
  // Filter employees based on search query - search in name, matricule, position and department and site
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.site.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const onClockInOut = async (employeeId: string) => {
    if (onClockIn) {
      // Use provided onClockIn callback if available
      await onClockIn(employeeId, "Pointé via dialogue");
    } else {
      // Otherwise use default handler
      const success = await handleClockInOut(employeeId, "Pointé via dialogue");
      if (success) {
        // Only close dialog on success if needed
        // setIsOpen(false);
      }
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Clock size={16} className="mr-2" />
          <span>Pointer entrée/sortie</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
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
              placeholder="Rechercher un employé par matricule, nom ou site..."
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
                <TableHead className="w-[180px]">Matricule</TableHead>
                <TableHead>Employé</TableHead>
                <TableHead>Site</TableHead>
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
                    <TableCell className="font-medium">{employee.matricule}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {employee.avatar ? (
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                          ) : (
                            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.position}</p>
                        </div>
                        {isActive && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-green-500 ml-2" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{employee.site}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={isActive ? "destructive" : "secondary"}
                        size="sm"
                        onClick={() => onClockInOut(employee.id)}
                        disabled={isClockingIn || isClockingOut}
                      >
                        {(isClockingIn || isClockingOut) ? (
                          <Loader2 size={14} className="mr-1 animate-spin" />
                        ) : (
                          <Clock size={14} className="mr-1" />
                        )}
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
