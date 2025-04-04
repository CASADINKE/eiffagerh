
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clockInEmployee, clockOutEmployee, updateTimeEntry, deleteTimeEntry } from "./api";

// Mutation hooks for time entries
export const useClockInMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ employeeId, notes }: { employeeId: string, notes?: string }) => 
      clockInEmployee(employeeId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      toast.success("Pointage d'entrée enregistré avec succès");
    },
    onError: (error) => {
      console.error("Clock in mutation error:", error);
      toast.error(`Erreur lors du pointage d'entrée: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};

export const useClockOutMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entryId: string) => clockOutEmployee(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      toast.success("Pointage de sortie enregistré avec succès");
    },
    onError: (error) => {
      console.error("Clock out mutation error:", error);
      toast.error(`Erreur lors du pointage de sortie: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};

// Add mutations for update and delete time entries
export const useUpdateTimeEntryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => 
      updateTimeEntry(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      toast.success("Entrée de temps mise à jour avec succès");
    },
    onError: (error) => {
      console.error("Update time entry mutation error:", error);
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};

export const useDeleteTimeEntryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteTimeEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      toast.success("Entrée de temps supprimée avec succès");
    },
    onError: (error) => {
      console.error("Delete time entry mutation error:", error);
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};
