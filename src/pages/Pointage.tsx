
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Search, FileDown, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePointages } from "@/hooks/usePointages";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useClockInMutation } from "@/hooks/timeEntries";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { EmployeeTimeClockDialog } from "@/components/timeTracking/EmployeeTimeClockDialog";

const Pointage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [searchDate, setSearchDate] = useState("");
  const [showClockInDialog, setShowClockInDialog] = useState(false);
  const { user } = useAuth();
  
  const userId = user?.id || "1";

  const {
    historyPointages,
    loading,
    calculateWorkDuration,
  } = usePointages(userId);

  const clockInMutation = useClockInMutation();

  const handleClockInDialogOpen = () => {
    setShowClockInDialog(true);
  };

  const handleClockIn = async (employeeId: string, notes?: string) => {
    try {
      await clockInMutation.mutateAsync({ 
        employeeId,
        notes: notes || "Pointé via l'application"
      });
      
      toast.success("Pointage d'entrée enregistré avec succès");
      setShowClockInDialog(false);
    } catch (error) {
      console.error("Error clocking in:", error);
      toast.error("Erreur lors du pointage d'entrée");
    }
  };

  const filterHistoryByDate = () => {
    if (!searchDate) return historyPointages;
    
    return historyPointages.filter(
      pointage => pointage.date === searchDate
    );
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "HH:mm");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const getStatusBadge = (status: 'present' | 'en_retard' | 'absent') => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Présent</Badge>;
      case 'en_retard':
        return <Badge variant="warning">En retard</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const filteredHistory = filterHistoryByDate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📍 Historique des pointages</h1>
        <Button size="lg" onClick={handleClockInDialogOpen}>
          🟢 Pointer l'entrée
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Calendrier et recherche</CardTitle>
            <CardDescription>
              Consultez l'historique de vos pointages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-8 w-48"
                  onChange={(e) => setSearchDate(e.target.value)}
                  value={searchDate}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-32 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(month, "MMMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={month}
                    onSelect={(date) => date && setMonth(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>
              Sélectionnez une date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique de pointage</CardTitle>
          <CardDescription>
            Consultez l'historique de vos pointages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Entrée</TableHead>
                  <TableHead>Sortie</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Aucun pointage trouvé pour cette période
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((pointage) => (
                    <TableRow key={pointage.id}>
                      <TableCell>{formatDate(pointage.date)}</TableCell>
                      <TableCell>{formatTime(pointage.heure_entree)}</TableCell>
                      <TableCell>{formatTime(pointage.heure_sortie)}</TableCell>
                      <TableCell>
                        {calculateWorkDuration(pointage.heure_entree, pointage.heure_sortie)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(pointage.statut)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <EmployeeTimeClockDialog 
        open={showClockInDialog} 
        onOpenChange={setShowClockInDialog}
        onClockIn={handleClockIn}
      />
    </div>
  );
};

export default Pointage;
