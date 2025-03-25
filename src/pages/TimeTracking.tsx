
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
import { useEmployees, useEmployeesUI } from "@/hooks/useEmployees";
import { TimeTrackingHeader } from "@/components/timeTracking/TimeTrackingHeader";
import { TimeTrackingStats } from "@/components/timeTracking/TimeTrackingStats";
import { WorkingHoursChart } from "@/components/timeTracking/WorkingHoursChart";
import { TimeTrackingFilters, TimeTrackingFilters as TimeTrackingFiltersType } from "@/components/timeTracking/TimeTrackingFilters";
import { TimeEntriesTable } from "@/components/timeTracking/TimeEntriesTable";
import { EmployeeClockStatus } from "@/components/timeTracking/EmployeeClockStatus";
import { EmployeeTimeClockDialog } from "@/components/timeTracking/EmployeeTimeClockDialog";

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
  const [filters, setFilters] = useState<TimeTrackingFiltersType>({
    employeeId: null,
    dateRange: null
  });

  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const { data: employeesUI = [], isLoading: employeesUILoading } = useEmployeesUI();
  const { 
    data: timeEntries = [], 
    isLoading: entriesLoading,
    isError: entriesError
  } = useTimeEntries();
  const clockOutMutation = useClockOutMutation();

  console.log("TimeTracking: Loaded time entries:", timeEntries.length);

  const filteredTimeEntries = timeEntries.filter(entry => {
    if (!filters.dateRange?.from) return true;
    
    const entryDate = new Date(entry.date);
    const from = filters.dateRange.from;
    const to = filters.dateRange.to || from;
    
    const entryDateOnly = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
    const fromDateOnly = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const toDateOnly = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    
    return entryDateOnly >= fromDateOnly && entryDateOnly <= toDateOnly;
  });

  console.log("TimeTracking: Filtered by date range:", filteredTimeEntries.length);

  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
  
  const tabFilteredEntries = filteredTimeEntries.filter(entry => {
    const entryDate = format(new Date(entry.date), "yyyy-MM-dd");
    
    if (activeTab === "today") return entryDate === today;
    if (activeTab === "yesterday") return entryDate === yesterday;
    return true;
  });

  console.log(`TimeTracking: Tab filtered (${activeTab}):`, tabFilteredEntries.length);

  const activeEmployeeCount = timeEntries.filter(
    entry => !entry.clock_out && format(new Date(entry.date), "yyyy-MM-dd") === today
  ).length;

  const completedEntriesForToday = timeEntries.filter(
    entry => entry.clock_out && format(new Date(entry.date), "yyyy-MM-dd") === today
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

  const isLoading = employeesLoading || entriesLoading || employeesUILoading;

  const handleFilterChange = (newFilters: TimeTrackingFiltersType) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      employeeId: null,
      dateRange: null
    });
  };

  console.log("TimeTracking: Rendering with", tabFilteredEntries.length, "entries");

  return (
    <div className="container mx-auto">
      <TimeTrackingHeader />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suivi du temps de travail</h1>
        <EmployeeTimeClockDialog className="ml-auto" />
      </div>
      
      <TimeTrackingStats 
        activeEmployeeCount={activeEmployeeCount}
        averageHours={averageHours}
        totalEntries={filteredTimeEntries.length}
        totalEmployees={employeesUI.length}
      />
      
      <WorkingHoursChart data={workingHoursData} />
      
      <TimeTrackingFilters
        employees={employees}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between p-4 border-b border-border">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="yesterday">Hier</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="today" className="m-0">
            <TimeEntriesTable 
              timeEntries={tabFilteredEntries}
              isLoading={isLoading}
              entriesError={entriesError}
              handleClockOut={handleClockOut}
            />
          </TabsContent>
          
          <TabsContent value="yesterday" className="m-0">
            <TimeEntriesTable 
              timeEntries={tabFilteredEntries}
              isLoading={isLoading}
              entriesError={entriesError}
              handleClockOut={handleClockOut}
            />
          </TabsContent>
          
          <TabsContent value="history" className="m-0">
            <TimeEntriesTable 
              timeEntries={tabFilteredEntries}
              isLoading={isLoading}
              entriesError={entriesError}
              handleClockOut={handleClockOut}
            />
          </TabsContent>
        </Tabs>
      </Card>
      
      <EmployeeClockStatus 
        employees={employeesUI}
        timeEntries={timeEntries}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TimeTracking;
