
import { useQuery } from "@tanstack/react-query";
import { fetchTimeEntries } from "./api";

// Hook to fetch time entries
export const useTimeEntries = (employeeFilter?: string) => {
  return useQuery({
    queryKey: ["timeEntries", employeeFilter],
    queryFn: async () => {
      const entries = await fetchTimeEntries();
      console.log("Entries fetched, total:", entries.length);
      
      // Filter by employee if specified
      if (employeeFilter && employeeFilter !== "all") {
        const filtered = entries.filter(entry => entry.employee_id === employeeFilter);
        console.log(`Filtered by employee ${employeeFilter}:`, filtered.length);
        return filtered;
      }
      
      return entries;
    }
  });
};
