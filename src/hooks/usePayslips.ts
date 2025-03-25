
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchPayslips, 
  updatePayslipStatus, 
  deletePayslip,
  generatePayslipPDF,
  getPayslipById,
  PayslipStatus, 
  PaymentMethod,
  Payslip 
} from "@/services/payslipService";

export const usePayslips = () => {
  const queryClient = useQueryClient();
  
  const {
    data: payslips,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['payslips'],
    queryFn: fetchPayslips,
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ 
      payslipId, 
      status, 
      paymentMethod, 
      paymentDate 
    }: { 
      payslipId: string; 
      status: PayslipStatus; 
      paymentMethod?: PaymentMethod; 
      paymentDate?: string;
    }) => {
      return updatePayslipStatus(payslipId, status, paymentMethod, paymentDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] });
    },
  });
  
  const deletePayslipMutation = useMutation({
    mutationFn: (payslipId: string) => {
      return deletePayslip(payslipId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] });
    },
  });
  
  const downloadPayslipMutation = useMutation({
    mutationFn: async (payslipId: string) => {
      const payslip = await getPayslipById(payslipId);
      return generatePayslipPDF(payslip);
    },
  });
  
  return {
    payslips,
    isLoading,
    error,
    refetch,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    deletePayslip: deletePayslipMutation.mutate,
    isDeleting: deletePayslipMutation.isPending,
    downloadPayslip: downloadPayslipMutation.mutate,
    isDownloading: downloadPayslipMutation.isPending
  };
};
