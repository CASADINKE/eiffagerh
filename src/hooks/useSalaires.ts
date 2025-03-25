import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchSalaires, 
  createSalaire, 
  updateSalaireStatus, 
  getSalairesByMatricule,
  getSalaireById,
  deleteSalaire as deleteSalaireService,
  generatePDF as generatePDFService,
  SalaireFormData,
  Salaire,
  SalairePaiementStatus,
  ModePaiement
} from "@/services/salaireService";

export const useSalaires = () => {
  const queryClient = useQueryClient();
  
  const { data: salaires, isLoading, error } = useQuery({
    queryKey: ['salaires'],
    queryFn: fetchSalaires
  });
  
  const { mutate: createSalaireMutation, isPending: isCreating } = useMutation({
    mutationFn: (formData: SalaireFormData) => createSalaire(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaires'] });
    }
  });
  
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ salaireId, status, modePaiement, datePaiement }: {
      salaireId: string;
      status: SalairePaiementStatus;
      modePaiement?: ModePaiement;
      datePaiement?: string;
    }) => updateSalaireStatus(salaireId, status, modePaiement, datePaiement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaires'] });
    }
  });
  
  const { mutate: deleteSalaire, isPending: isDeleting } = useMutation({
    mutationFn: (salaireId: string) => deleteSalaireService(salaireId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaires'] });
    }
  });

  const { mutate: generatePDF, isPending: isGenerating } = useMutation({
    mutationFn: (salaireId: string) => generatePDFService(salaireId),
  });
  
  return {
    salaires,
    isLoading,
    error,
    createSalaire: createSalaireMutation,
    isCreating,
    updateStatus,
    isUpdating,
    deleteSalaire,
    isDeleting,
    generatePDF,
    isGenerating
  };
};

export const useEmployeeSalaires = (matricule: string) => {
  const { data: salaires, isLoading, error } = useQuery({
    queryKey: ['salaires', matricule],
    queryFn: () => getSalairesByMatricule(matricule),
    enabled: !!matricule
  });
  
  return {
    salaires,
    isLoading,
    error
  };
};

export const useSalaireById = (salaireId: string) => {
  const { data: salaire, isLoading, error } = useQuery({
    queryKey: ['salaires', salaireId],
    queryFn: () => getSalaireById(salaireId),
    enabled: !!salaireId
  });
  
  return {
    salaire,
    isLoading,
    error
  };
};
