
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Square, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeePointage, calculatePointageDuration } from "@/hooks/useEmployeePointage";

interface EmployeePointagesTableProps {
  pointages: EmployeePointage[];
  isLoading: boolean;
  entriesError?: unknown;
  handleClockOut: (entryId: string) => void;
}

export const EmployeePointagesTable = ({
  pointages,
  isLoading,
  entriesError,
  handleClockOut,
}: EmployeePointagesTableProps) => {
  const getInitials = (name: string = "") => {
    return name.split(" ").map(n => n[0]).join("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Chargement des pointages...</p>
      </div>
    );
  }
  
  if (entriesError) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Une erreur est survenue lors du chargement des pointages.</p>
        <p className="text-sm text-muted-foreground mt-2">Veuillez réessayer ultérieurement.</p>
      </div>
    );
  }
  
  if (pointages.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Aucun pointage trouvé pour les critères sélectionnés.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Entrée</TableHead>
            <TableHead>Sortie</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pointages.map((entry) => {
            const isActive = !entry.clock_out;
            const formattedClockIn = format(new Date(entry.clock_in), "HH:mm", { locale: fr });
            const formattedClockOut = entry.clock_out 
              ? format(new Date(entry.clock_out), "HH:mm", { locale: fr }) 
              : "--:--";
            const duration = calculatePointageDuration(entry.clock_in, entry.clock_out);
            
            return (
              <TableRow key={entry.id}>
                <TableCell>
                  {entry.employee && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        {entry.employee.avatar ? (
                          <AvatarImage src={entry.employee.avatar} alt={entry.employee.name} />
                        ) : (
                          <AvatarFallback>{getInitials(entry.employee.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span>{entry.employee.name}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{entry.employee?.department || "Non assigné"}</TableCell>
                <TableCell>{formattedClockIn}</TableCell>
                <TableCell>{formattedClockOut}</TableCell>
                <TableCell>{duration}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {isActive ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span>Actif</span>
                      </>
                    ) : (
                      <span>Terminé</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {isActive ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleClockOut(entry.id)}
                    >
                      <Square size={14} />
                      <span>Pointer sortie</span>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-1" disabled>
                      <Clock size={14} />
                      <span>Terminé</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
