
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchPayslips, 
  updatePayslipStatus, 
  PayslipStatus, 
  PaymentMethod 
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
  
  return {
    payslips,
    isLoading,
    error,
    refetch,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending
  };
};
