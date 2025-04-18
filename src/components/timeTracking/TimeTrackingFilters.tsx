
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Employee } from "@/hooks/useEmployees";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export interface TimeTrackingFiltersProps {
  employees: Employee[];
  onFilterChange: (filters: TimeTrackingFilters) => void;
  filters: TimeTrackingFilters;
  onResetFilters: () => void;
}

export interface TimeTrackingFilters {
  employeeId: string | null;
  dateRange: {
    from: Date | null;
    to: Date | null;
  } | null;
}

export const TimeTrackingFilters: React.FC<TimeTrackingFiltersProps> = ({
  onFilterChange,
  filters,
  onResetFilters,
}) => {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  const handleDateChange = (date: { from?: Date | null; to?: Date | null }) => {
    handleFilterChange("dateRange", {
      from: date.from || null,
      to: date.to || null,
    });
  };

  const handleFilterChange = (key: keyof TimeTrackingFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleResetDate = () => {
    handleFilterChange("dateRange", null);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="w-full sm:w-auto">
          <Label htmlFor="date-filter" className="mb-2 block">
            Période
          </Label>
          <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[200px] justify-start text-left font-normal",
                  !filters.dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "dd MMMM yyyy", { locale: fr })} -{" "}
                      {format(filters.dateRange.to, "dd MMMM yyyy", { locale: fr })}
                    </>
                  ) : (
                    format(filters.dateRange.from, "dd MMMM yyyy", { locale: fr })
                  )
                ) : (
                  <span>Sélectionner une période</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={filters.dateRange?.from ? filters.dateRange.from : new Date()}
                selected={filters.dateRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
                locale={fr}
                pagedNavigation
                className="border-0 rounded-md overflow-hidden"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-2">
          {filters.dateRange?.from && (
            <Button variant="ghost" size="sm" onClick={handleResetDate}>
              <X className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onResetFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Réinitialiser tous les filtres
          </Button>
        </div>
      </div>
    </Card>
  );
};
