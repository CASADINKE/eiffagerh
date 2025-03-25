
import { useQuery } from "@tanstack/react-query";
import { getBulletinsPaieByMatricule } from "@/services/payslipService";

// Hook to fetch payslips for a specific employee by matricule
export const useEmployeePayslips = (matricule: string | null) => {
  return useQuery({
    queryKey: ["employee-payslips", matricule],
    queryFn: () => matricule ? getBulletinsPaieByMatricule(matricule) : Promise.resolve([]),
    enabled: !!matricule,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
