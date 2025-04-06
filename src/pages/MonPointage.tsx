
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, ArrowRight, ArrowLeft, FileDown, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { usePointage } from "@/hooks/usePointage";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const MonPointage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [searchDate, setSearchDate] = useState("");
  const [remarkDialog, setRemarkDialog] = useState(false);
  const [clockType, setClockType] = useState<"in" | "out">("in");
  const [remark, setRemark] = useState("");
  
  const {
    todayPointage,
    historyPointages,
    loading,
    clockIn,
    clockOut,
    calculateWorkDuration,
    clockInLoading,
    clockOutLoading,
    fetchHistoryPointages
  } = usePointage();

  useEffect(() => {
    if (month) {
      fetchHistoryPointages(month.getMonth(), month.getFullYear());
    }
  }, [month, fetchHistoryPointages]);

  const handleClockIn = async () => {
    setClockType("in");
    setRemarkDialog(true);
  };

  const handleClockOut = async () => {
    setClockType("out");
    setRemarkDialog(true);
  };

  const handleSubmitRemark = async () => {
    if (clockType === "in") {
      await clockIn(remark);
    } else {
      await clockOut(remark);
    }
    setRemark("");
    setRemarkDialog(false);
  };

  const filterHistoryByDate = () => {
    if (!searchDate) return historyPointages;
    
    return historyPointages.filter(
      pointage => pointage.date_pointage === searchDate
    );
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "HH:mm");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const filteredHistory = filterHistoryByDate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📍 Mon Pointage</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Mon Pointage du jour</CardTitle>
            <CardDescription>
              {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Heure d'arrivée</p>
                      <p className="text-xl font-medium">
                        {todayPointage?.heure_arrivee 
                          ? formatTime(todayPointage.heure_arrivee)
                          : "--:--"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Heure de départ</p>
                      <p className="text-xl font-medium">
                        {todayPointage?.heure_depart 
                          ? formatTime(todayPointage.heure_depart)
                          : "--:--"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Durée travaillée</p>
                      <p className="text-xl font-medium">
                        {todayPointage?.duree_travail || (todayPointage?.heure_arrivee && 
                          calculateWorkDuration(todayPointage.heure_arrivee, todayPointage.heure_depart))}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="w-48"
                    onClick={handleClockIn}
                    disabled={clockInLoading || !!todayPointage?.heure_arrivee}
                  >
                    {clockInLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Pointer l'arrivée
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="destructive" 
                    className="w-48"
                    onClick={handleClockOut}
                    disabled={clockOutLoading || !todayPointage?.heure_arrivee || !!todayPointage?.heure_depart}
                  >
                    {clockOutLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    )}
                    Pointer le départ
                  </Button>
                </div>
                
                {todayPointage?.remarque && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="font-medium mb-1">Remarque:</p>
                    <p>{todayPointage.remarque}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>
              Sélectionnez un mois pour l'historique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              month={month}
              onMonthChange={setMonth}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mon Historique de Pointage</CardTitle>
            <CardDescription>
              Consultez votre historique des pointages
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative">
              <Input
                type="date"
                className="w-48"
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
          </div>
          
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
                  <TableHead>Remarque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Aucun pointage trouvé pour cette période
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((pointage) => (
                    <TableRow key={pointage.id}>
                      <TableCell>{formatDate(pointage.date_pointage)}</TableCell>
                      <TableCell>{formatTime(pointage.heure_arrivee)}</TableCell>
                      <TableCell>{formatTime(pointage.heure_depart)}</TableCell>
                      <TableCell>
                        {pointage.duree_travail || calculateWorkDuration(pointage.heure_arrivee, pointage.heure_depart)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pointage.heure_depart ? "success" : "warning"}>
                          {pointage.heure_depart ? "Terminé" : "En cours"}
                        </Badge>
                      </TableCell>
                      <TableCell>{pointage.remarque || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={remarkDialog} onOpenChange={setRemarkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {clockType === "in" ? "Ajouter une remarque (Arrivée)" : "Ajouter une remarque (Départ)"}
            </DialogTitle>
            <DialogDescription>
              Vous pouvez ajouter une remarque facultative à votre pointage.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Retard dû au transport, RDV externe, etc."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemarkDialog(false)}>Annuler</Button>
            <Button onClick={handleSubmitRemark}>
              {clockType === "in" ? "Pointer l'arrivée" : "Pointer le départ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonPointage;
