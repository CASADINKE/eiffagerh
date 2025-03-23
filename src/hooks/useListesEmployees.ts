
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "./useEmployees";

export const useListesEmployees = () => {
  return useQuery({
    queryKey: ["listes-employees"],
    queryFn: async (): Promise<Employee[]> => {
      const { data, error } = await supabase
        .from("listes_employées")
        .select("*")
        .order("nom", { ascending: true });

      if (error) {
        console.error("Error fetching listes_employées:", error);
        throw new Error(error.message);
      }

      return data as Employee[];
    },
  });
};
