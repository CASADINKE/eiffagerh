
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Search, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useEmployees } from "@/hooks/useEmployees";
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
  const { data: employees, isLoading, isError } = useEmployees();
  
  // Filter employees based on search query
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleClockInOut = (employeeId: string, name: string) => {
    // In a real implementation, you would call an API to clock in/out
    toast.success(`Pointage enregistré pour ${name}`);
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
          <div className="flex justify-center py-8">
            <p>Chargement des employés...</p>
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-destructive">
            <p>Erreur lors du chargement des employés. Veuillez réessayer.</p>
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
              {filteredEmployees.map((employee) => (
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
                    </div>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleClockInOut(employee.id, employee.name)}
                    >
                      <Clock size={14} />
                      <span>Pointer</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Aucun employé trouvé pour votre recherche.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
