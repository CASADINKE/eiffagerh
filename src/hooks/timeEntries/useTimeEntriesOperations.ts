
import { useCallback } from 'react';
import { useTimeEntries } from './useTimeEntries';
import { useClockInMutation, useClockOutMutation } from './useTimeEntriesMutations';
import { getActiveTimeEntry } from './utils';
import { toast } from 'sonner';

export const useTimeEntriesOperations = () => {
  const { data: timeEntries = [], refetch } = useTimeEntries();
  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  const handleClockInOut = useCallback(async (employeeId: string, notes?: string) => {
    try {
      // Check if employee is already clocked in
      const activeEntry = getActiveTimeEntry(timeEntries, employeeId);
      
      if (activeEntry) {
        // Clock out
        console.log("Clocking out employee, entry ID:", activeEntry.id);
        await clockOutMutation.mutateAsync(activeEntry.id);
      } else {
        // Clock in
        console.log("Clocking in employee:", employeeId);
        await clockInMutation.mutateAsync({ employeeId, notes });
      }
      
      // Refresh the time entries
      await refetch();
      return true;
    } catch (error) {
      console.error("Error in handleClockInOut:", error);
      toast.error("Une erreur est survenue lors du pointage");
      return false;
    }
  }, [timeEntries, clockInMutation, clockOutMutation, refetch]);

  return {
    handleClockInOut,
    isClockingIn: clockInMutation.isPending,
    isClockingOut: clockOutMutation.isPending
  };
};
