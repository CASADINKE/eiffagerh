
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getSalaryDetails, 
  getEmployeeSalaryDetail, 
  createSalaryDetail, 
  updateSalaryDetail,
  SalaryDetail
} from "@/services/salaryDetailsService";

// Hook to fetch all salary details
export const useSalaryDetails = () => {
  return useQuery({
    queryKey: ["salary-details"],
    queryFn: () => getSalaryDetails(),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to fetch a specific employee's salary detail
export const useEmployeeSalaryDetail = (employeeId: string | null) => {
  return useQuery({
    queryKey: ["salary-detail", employeeId],
    queryFn: () => employeeId ? getEmployeeSalaryDetail(employeeId) : Promise.resolve(null),
    enabled: !!employeeId,
  });
};

// Hook to create a new salary detail
export const useCreateSalaryDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<SalaryDetail, 'id' | 'created_at' | 'updated_at'>) => 
      createSalaryDetail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-details"] });
    },
  });
};

// Hook to update a salary detail
export const useUpdateSalaryDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<SalaryDetail, 'id' | 'created_at' | 'updated_at'>> }) => 
      updateSalaryDetail(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["salary-details"] });
      queryClient.invalidateQueries({ queryKey: ["salary-detail", variables.data.employee_id] });
    },
  });
};
