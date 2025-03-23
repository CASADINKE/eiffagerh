
import { useQuery } from "@tanstack/react-query";
import { getSalaryPayments, getPayslipsByPaymentId, getPayslipById, SalaryPayment, Payslip } from "@/services/salaryPaymentService";

// Hook to fetch all salary payments
export const useSalaryPayments = () => {
  return useQuery({
    queryKey: ["salary-payments"],
    queryFn: () => getSalaryPayments(),
  });
};

// Hook to fetch payslips for a specific payment
export const usePayslipsByPaymentId = (paymentId: string | null) => {
  return useQuery({
    queryKey: ["payslips", paymentId],
    queryFn: () => paymentId ? getPayslipsByPaymentId(paymentId) : Promise.resolve([]),
    enabled: !!paymentId,
  });
};

// Hook to fetch a specific payslip by ID
export const usePayslipById = (payslipId: string | null) => {
  return useQuery({
    queryKey: ["payslip", payslipId],
    queryFn: () => payslipId ? getPayslipById(payslipId) : Promise.resolve(null),
    enabled: !!payslipId,
  });
};
