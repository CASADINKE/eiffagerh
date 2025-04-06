
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Clock, 
  CheckCircle2, 
  Calendar, 
  FileDown, 
  Loader2,
  History
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePointages } from "@/hooks/usePointages";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MonPointage = () => {
  const { user } = useAuth();
  const userId = user?.id || "";
  
  const {
    todayPointage,
    historyPointages,
    loading,
    clockIn,
    clockOut,
    calculateWorkDuration,
    clockInLoading,
    clockOutLoading
  } = usePointages(userId);

  const hasClockInToday = !!todayPointage?.heure_entree;
  const hasClockOutToday = !!todayPointage?.heure_sortie;

  const handleClockIn = async () => {
    if (hasClockInToday) {
      toast.info("Vous avez déjà pointé votre arrivée aujourd'hui");
      return;
    }
    
    await clockIn();
  };

  const handleClockOut = async () => {
    if (!hasClockInToday) {
      toast.error("Vous devez d'abord pointer votre arrivée");
      return;
    }
    
    if (hasClockOutToday) {
      toast.info("Vous avez déjà pointé votre départ aujourd'hui");
      return;
    }
    
    await clockOut();
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">🕒 Mon Pointage</h1>
          <p className="text-muted-foreground mt-2">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <div className="flex mt-4 md:mt-0 gap-4">
          <Button 
            size="lg" 
            onClick={handleClockIn}
            disabled={hasClockInToday || clockInLoading}
            className="relative"
          >
            {clockInLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Clock className="mr-2 h-5 w-5" />
            )}
            Pointer l'arrivée
            {hasClockInToday && (
              <div className="absolute -right-1 -top-1">
                <Badge variant="success" className="flex h-6 w-6 items-center justify-center rounded-full p-0">
                  <CheckCircle2 className="h-4 w-4" />
                </Badge>
              </div>
            )}
          </Button>
          <Button 
            size="lg" 
            onClick={handleClockOut}
            disabled={!hasClockInToday || hasClockOutToday || clockOutLoading}
            variant="secondary"
          >
            {clockOutLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            )}
            Pointer le départ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" /> 
              Aujourd'hui
            </CardTitle>
            <CardDescription>
              Statut de votre pointage pour aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-20 w-full" />
            ) : todayPointage ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground">Arrivée</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatTime(todayPointage.heure_entree)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground">Départ</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatTime(todayPointage.heure_sortie)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground">Durée</p>
                  <p className="text-2xl font-bold mt-1">
                    {calculateWorkDuration(todayPointage.heure_entree, todayPointage.heure_sortie)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <div className="mt-1">
                    {getStatusBadge(todayPointage.statut)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">Aucun pointage enregistré pour aujourd'hui</p>
                <Button 
                  onClick={handleClockIn} 
                  className="mt-4"
                  disabled={clockInLoading}
                >
                  {clockInLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Clock className="mr-2 h-4 w-4" />
                  )}
                  Pointer l'arrivée
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" /> 
                Historique des pointages
              </CardTitle>
              <CardDescription>
                Consultez l'historique de vos pointages
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
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
                  <TableHead>Arrivée</TableHead>
                  <TableHead>Départ</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyPointages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Aucun pointage trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  historyPointages.map((pointage) => (
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
    </div>
  );
};

export default MonPointage;
