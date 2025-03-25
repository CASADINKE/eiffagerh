
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
import { useState } from "react";
import { Salaire } from "@/services/salaireService";

export const usePayslips = () => {
  const queryClient = useQueryClient();
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
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
    mutationFn: (payslip: Payslip) => {
      return generatePayslipPDF(payslip);
    },
  });
  
  const viewPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setIsPrintModalOpen(true);
  };
  
  const closePayslipModal = () => {
    setIsPrintModalOpen(false);
    setSelectedPayslip(null);
  };
  
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
    isDownloading: downloadPayslipMutation.isPending,
    selectedPayslip,
    isPrintModalOpen,
    viewPayslip,
    closePayslipModal
  };
};
