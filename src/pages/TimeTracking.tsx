
import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTimeEntries, useClockOutMutation, calculateDuration, getActiveTimeEntry } from "@/hooks/useTimeEntries";
import { useEmployees } from "@/hooks/useEmployees";
import { TimeTrackingHeader } from "@/components/timeTracking/TimeTrackingHeader";
import { TimeTrackingStats } from "@/components/timeTracking/TimeTrackingStats";
import { WorkingHoursChart } from "@/components/timeTracking/WorkingHoursChart";
import { TimeTrackingFilters } from "@/components/timeTracking/TimeTrackingFilters";
import { TimeEntriesTable } from "@/components/timeTracking/TimeEntriesTable";
import { handleExportTimeEntries } from "@/components/timeTracking/TimeTrackingUtils";

const workingHoursData = [
  { day: "Lun", hours: 8.2 },
  { day: "Mar", hours: 8.5 },
  { day: "Mer", hours: 7.8 },
  { day: "Jeu", hours: 8.3 },
  { day: "Ven", hours: 7.5 },
  { day: "Sam", hours: 4.2 },
  { day: "Dim", hours: 0 },
];

const TimeTracking = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [dateFilter, setDateFilter] = useState("today");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("month");

  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const { 
    data: timeEntries = [], 
    isLoading: entriesLoading,
    isError: entriesError
  } = useTimeEntries(employeeFilter !== "all" ? employeeFilter : undefined);
  const clockOutMutation = useClockOutMutation();

  const getFilterDate = (date: string) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");

  const filteredTimeEntries = timeEntries.filter(entry => {
    const entryDate = getFilterDate(entry.date);
    return (
      (dateFilter === "today" && entryDate === today) ||
      (dateFilter === "yesterday" && entryDate === yesterday) ||
      dateFilter === "all"
    );
  });

  const activeEmployeeCount = timeEntries.filter(
    entry => !entry.clock_out && getFilterDate(entry.date) === today
  ).length;

  const completedEntriesForToday = timeEntries.filter(
    entry => entry.clock_out && getFilterDate(entry.date) === today
  );

  const totalCompletedHours = completedEntriesForToday.reduce((acc, entry) => {
    const duration = calculateDuration(entry.clock_in, entry.clock_out, entry.break_time);
    if (duration === "en cours") return acc;
    
    const [hours, minutes] = duration.split("h ").map(part => parseFloat(part.replace("m", "")));
    return acc + hours + (minutes / 60 || 0);
  }, 0);

  const averageHours = completedEntriesForToday.length 
    ? (totalCompletedHours / completedEntriesForToday.length).toFixed(1) 
    : 0;

  const handleClockOut = (entryId: string) => {
    clockOutMutation.mutate(entryId);
  };

  const isLoading = employeesLoading || entriesLoading;

  const handleExport = (format = 'csv') => {
    handleExportTimeEntries(filteredTimeEntries, dateFilter, periodFilter, format);
  };

  return (
    <div className="container mx-auto">
      <TimeTrackingHeader handleExport={handleExport} />
      
      <TimeTrackingStats 
        activeEmployeeCount={activeEmployeeCount}
        averageHours={averageHours}
        totalEntries={filteredTimeEntries.length}
      />
      
      <WorkingHoursChart data={workingHoursData} />
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between p-4 border-b border-border">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="yesterday">Hier</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
            
            <TimeTrackingFilters 
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              periodFilter={periodFilter}
              setPeriodFilter={setPeriodFilter}
              employeeFilter={employeeFilter}
              setEmployeeFilter={setEmployeeFilter}
              employees={employees}
            />
          </div>
          
          <TabsContent value="today" className="m-0">
            <TimeEntriesTable 
              timeEntries={filteredTimeEntries}
              isLoading={isLoading}
              entriesError={entriesError}
              handleClockOut={handleClockOut}
            />
          </TabsContent>
          
          <TabsContent value="yesterday" className="m-0">
            <TimeEntriesTable 
              timeEntries={filteredTimeEntries}
              isLoading={isLoading}
              entriesError={entriesError}
              handleClockOut={handleClockOut}
            />
          </TabsContent>
          
          <TabsContent value="history" className="m-0">
            <TimeEntriesTable 
              timeEntries={filteredTimeEntries}
              isLoading={isLoading}
              entriesError={entriesError}
              handleClockOut={handleClockOut}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default TimeTracking;
