
import { useState } from "react";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Search, FileDown, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEmployeePersonalPointage } from "@/hooks/useEmployeePersonalPointage";
import { Skeleton } from "@/components/ui/skeleton";
import { format as formatFns } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Demo: Using a fixed employee ID for now
// In a real implementation, you'd get this from auth context
const DEMO_EMPLOYEE_ID = "1";

const Pointage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [searchDate, setSearchDate] = useState("");

  const {
    todayPointage,
    historyPointages,
    loading,
    clockIn,
    clockOut,
    calculateWorkDuration
  } = useEmployeePersonalPointage(DEMO_EMPLOYEE_ID);

  const handleClockIn = () => {
    clockIn();
  };

  const handleClockOut = () => {
    clockOut();
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

  const filteredHistory = filterHistoryByDate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📍 Pointage du jour</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Status Card */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>État du jour • {format(new Date(), "EEEE dd MMMM yyyy", { locale: fr })}</CardTitle>
            <CardDescription>
              Suivez votre pointage quotidien
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ) : (
              <div className="space-y-4">
                {todayPointage?.clock_in ? (
                  <div className="flex items-center text-lg">
                    <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                    <span>Vous avez pointé à {formatTime(todayPointage.clock_in)}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-lg">
                    <XCircle className="mr-2 h-6 w-6 text-red-500" />
                    <span>Vous n'avez pas encore pointé aujourd'hui</span>
                  </div>
                )}
                
                {todayPointage?.clock_in && (
                  <div className="flex items-center text-lg">
                    <Clock className="mr-2 h-6 w-6 text-blue-500" />
                    <span>Temps de travail aujourd'hui : {calculateWorkDuration(todayPointage.clock_in, todayPointage.clock_out)}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              size="lg"
              onClick={handleClockIn}
              disabled={loading || !!todayPointage?.clock_in}
              className="flex items-center"
            >
              <span className="mr-2">🟢</span>
              Pointer l'entrée
            </Button>
            <Button
              size="lg"
              onClick={handleClockOut}
              disabled={loading || !todayPointage?.clock_in || !!todayPointage?.clock_out}
              variant="destructive"
              className="flex items-center"
            >
              <span className="mr-2">🔴</span>
              Pointer la sortie
            </Button>
          </CardFooter>
        </Card>

        {/* Calendar Card */}
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

      {/* History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Historique de pointage</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardDescription>
              Consultez l'historique de vos pointages
            </CardDescription>
            <div className="flex flex-wrap gap-2">
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
                      <TableCell>{formatTime(pointage.clock_in)}</TableCell>
                      <TableCell>{formatTime(pointage.clock_out)}</TableCell>
                      <TableCell>
                        {calculateWorkDuration(pointage.clock_in, pointage.clock_out)}
                      </TableCell>
                      <TableCell>
                        {pointage.clock_in && pointage.clock_out ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Complet
                          </Badge>
                        ) : pointage.clock_in ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                            En cours
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            Non pointé
                          </Badge>
                        )}
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

export default Pointage;
