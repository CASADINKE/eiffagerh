
import { useState } from "react";
import { Clock, Search, Loader2, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { useEmployeesUI } from "@/hooks/useEmployees";
import { useTimeEntries, getActiveTimeEntry } from "@/hooks/timeEntries";
import { useTimeEntriesBatchOperations } from "@/hooks/timeEntries/useTimeEntriesBatchOperations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface BatchTimeClockDialogProps {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BatchTimeClockDialog({ 
  className, 
  open: controlledOpen, 
  onOpenChange: setControlledOpen 
}: BatchTimeClockDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [action, setAction] = useState<"in" | "out">("in");
  
  // Use the controlled open state if provided, otherwise use local state
  const isOpen = controlledOpen !== undefined ? controlledOpen : open;
  const setIsOpen = setControlledOpen || setOpen;
  
  // Use the employees hook to get the list of employees
  const { data: employees = [], isLoading: employeesLoading } = useEmployeesUI();
  
  // Fetch time entries to know which employees are already clocked in
  const { data: timeEntries = [], isLoading: entriesLoading } = useTimeEntries();
  
  // Batch time entries operations
  const {
    selectedEmployees,
    isProcessing,
    toggleEmployeeSelection,
    selectAllEmployees,
    clearSelection,
    batchClockIn,
    batchClockOut
  } = useTimeEntriesBatchOperations();
  
  // Loading state combines both employees and entries loading
  const isLoading = employeesLoading || entriesLoading;
  
  // Filter employees based on search query
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.site.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      clearSelection();
    } else {
      selectAllEmployees(filteredEmployees.map(emp => emp.id));
    }
  };
  
  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Veuillez sélectionner au moins un employé");
      return;
    }
    
    let success = false;
    
    if (action === "in") {
      success = await batchClockIn(notes);
    } else {
      success = await batchClockOut();
    }
    
    if (success) {
      setIsOpen(false);
      setNotes("");
      clearSelection();
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">
          <CheckSquare size={16} className="mr-2" />
          <span>Pointage multiple</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Pointage multiple d'employés</DialogTitle>
          <DialogDescription>
            Sélectionnez plusieurs employés pour effectuer un pointage groupé.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={action === "in" ? "default" : "outline"}
              onClick={() => setAction("in")}
              disabled={isProcessing}
            >
              Entrée
            </Button>
            <Button
              variant={action === "out" ? "default" : "outline"}
              onClick={() => setAction("out")}
              disabled={isProcessing}
            >
              Sortie
            </Button>
          </div>
        </div>
        
        {action === "in" && (
          <div className="mb-4">
            <Textarea
              placeholder="Notes de pointage (optionnel)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Chargement des employés...</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">Matricule</TableHead>
                  <TableHead>Employé</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead className="w-[100px]">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Aucun employé trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => {
                    // Check if employee is currently clocked in
                    const activeEntry = getActiveTimeEntry(timeEntries, employee.id);
                    const isActive = !!activeEntry;
                    const isSelected = selectedEmployees.includes(employee.id);
                    
                    return (
                      <TableRow key={employee.id} className={isSelected ? "bg-muted/50" : undefined}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                          />
                        </TableCell>
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
                          </div>
                        </TableCell>
                        <TableCell>{employee.site}</TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge variant="success" className="w-full justify-center">Pointé</Badge>
                          ) : (
                            <Badge variant="outline" className="w-full justify-center">En attente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
        
        <div className="mt-2 text-sm text-muted-foreground">
          {selectedEmployees.length > 0 ? (
            <p>{selectedEmployees.length} employé(s) sélectionné(s)</p>
          ) : (
            <p>Aucun employé sélectionné</p>
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing || selectedEmployees.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                {action === "in" ? "Pointer l'entrée" : "Pointer la sortie"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
