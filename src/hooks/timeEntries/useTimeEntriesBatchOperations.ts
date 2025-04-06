
import { useState } from 'react';
import { useTimeEntries } from './useTimeEntries';
import { useClockInMutation, useClockOutMutation } from './useTimeEntriesMutations';
import { getActiveTimeEntry } from './utils';
import { toast } from 'sonner';

export const useTimeEntriesBatchOperations = () => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: timeEntries = [], refetch } = useTimeEntries();
  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const selectAllEmployees = (employeeIds: string[]) => {
    setSelectedEmployees(employeeIds);
  };

  const clearSelection = () => {
    setSelectedEmployees([]);
  };

  const batchClockIn = async (notes?: string) => {
    if (selectedEmployees.length === 0) {
      toast.error("Aucun employé sélectionné");
      return false;
    }

    setIsProcessing(true);
    let success = true;
    const processed: string[] = [];

    try {
      for (const employeeId of selectedEmployees) {
        // Check if employee is already clocked in
        const activeEntry = getActiveTimeEntry(timeEntries, employeeId);
        
        if (!activeEntry) {
          try {
            await clockInMutation.mutateAsync({ 
              employeeId, 
              notes: notes || "Pointage en lot" 
            });
            processed.push(employeeId);
          } catch (error) {
            console.error(`Error clocking in employee ${employeeId}:`, error);
            success = false;
          }
        }
      }

      await refetch();
      
      if (processed.length > 0) {
        toast.success(`${processed.length} employé(s) pointé(s) avec succès`);
      } else {
        toast.info("Aucun employé n'a été pointé, ils ont peut-être déjà pointé");
      }
      
      return success && processed.length > 0;
    } catch (error) {
      console.error("Error in batch clock in:", error);
      toast.error("Une erreur est survenue lors du pointage en lot");
      return false;
    } finally {
      setIsProcessing(false);
      clearSelection();
    }
  };

  const batchClockOut = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Aucun employé sélectionné");
      return false;
    }

    setIsProcessing(true);
    let success = true;
    const processed: string[] = [];

    try {
      for (const employeeId of selectedEmployees) {
        // Check if employee is already clocked in
        const activeEntry = getActiveTimeEntry(timeEntries, employeeId);
        
        if (activeEntry) {
          try {
            await clockOutMutation.mutateAsync(activeEntry.id);
            processed.push(employeeId);
          } catch (error) {
            console.error(`Error clocking out employee ${employeeId}:`, error);
            success = false;
          }
        }
      }

      await refetch();
      
      if (processed.length > 0) {
        toast.success(`${processed.length} employé(s) déconnecté(s) avec succès`);
      } else {
        toast.info("Aucun employé n'a été déconnecté, ils n'ont peut-être pas encore pointé");
      }
      
      return success && processed.length > 0;
    } catch (error) {
      console.error("Error in batch clock out:", error);
      toast.error("Une erreur est survenue lors du déconnexion en lot");
      return false;
    } finally {
      setIsProcessing(false);
      clearSelection();
    }
  };

  return {
    selectedEmployees,
    isProcessing,
    toggleEmployeeSelection,
    selectAllEmployees,
    clearSelection,
    batchClockIn,
    batchClockOut,
  };
};
