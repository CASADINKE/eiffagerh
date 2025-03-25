import { useQuery } from "@tanstack/react-query";
import { getBulletinsPaieByMatricule } from "@/services/payslipService";

// Hook to fetch payslips for a specific employee by matricule
export const useEmployeePayslips = (matricule: string | null) => {
  return useQuery({
    queryKey: ["employee-payslips", matricule],
    queryFn: async () => {
      if (!matricule) return [];
      
      // Fetch payslips
      const payslips = await getBulletinsPaieByMatricule(matricule);
      
      // Return sanitized payslips without detailed salary information
      return payslips.map(payslip => ({
        ...payslip,
        // Masking sensitive financial data
        retenue_ir: undefined,
        ipres_general: undefined,
        trimf: undefined,
        salaire_base: undefined,
        sursalaire: undefined,
        indemnite_deplacement: undefined,
        prime_transport: undefined,
        total_brut: undefined,
        // Keep only basic information
        id: payslip.id,
        matricule: payslip.matricule,
        nom: payslip.nom,
        periode_paie: payslip.periode_paie,
        net_a_payer: payslip.net_a_payer,
        created_at: payslip.created_at,
        updated_at: payslip.updated_at,
        status: payslip.status
      }));
    },
    enabled: !!matricule,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
