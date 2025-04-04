import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeUI } from '@/types/employee';
import { toast } from 'sonner';

export interface EmployeePointage {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  break_time: number;
  notes: string;
  employee: EmployeeUI;
}

export const useEmployeePointage = (employeeId?: string) => {
  const [pointages, setPointages] = useState<EmployeePointage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPointages();
  }, [employeeId]);

  const fetchPointages = async () => {
    setLoading(true);
    try {
      const query = supabase
        .from('pointages')
        .select(`
          *,
          employee:employee_id(
            id, 
            nom, 
            prenom, 
            matricule, 
            poste,
            affectation,
            telephone,
            site,
            employeur
          )
        `)
        .order('date', { ascending: false });

      if (employeeId) {
        query.eq('employee_id', employeeId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedPointages = data.map((entry: any) => ({
        id: entry.id,
        employee_id: entry.employee_id,
        clock_in: entry.clock_in,
        clock_out: entry.clock_out,
        date: entry.date,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        break_time: entry.break_time,
        notes: entry.notes,
        employee: {
          id: entry.employee.id,
          name: `${entry.employee.prenom} ${entry.employee.nom}`,
          department: entry.employee.affectation,
          position: entry.employee.poste,
          email: "email@example.com", // Default email since it's not in the database
          phone: entry.employee.telephone,
          status: "active" as const,
          matricule: entry.employee.matricule,
          site: entry.employee.site,
          employer: entry.employee.employeur,
          avatar: null,
        }
      })) as EmployeePointage[];

      setPointages(formattedPointages);
    } catch (err: any) {
      console.error('Error fetching pointages:', err);
      setError(err);
      toast.error('Erreur lors du chargement des pointages');
    } finally {
      setLoading(false);
    }
  };

  const createPointage = async (pointage: Omit<EmployeePointage, 'id' | 'created_at' | 'updated_at' | 'employee'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pointages')
        .insert(pointage)
        .select('*');

      if (error) throw error;

      toast.success('Pointage créé avec succès');
      fetchPointages();
      return data;
    } catch (err: any) {
      console.error('Error creating pointage:', err);
      setError(err);
      toast.error('Erreur lors de la création du pointage');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePointage = async (id: string, updates: Partial<Omit<EmployeePointage, 'id' | 'created_at' | 'updated_at' | 'employee'>>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pointages')
        .update(updates)
        .eq('id', id)
        .select('*');

      if (error) throw error;

      toast.success('Pointage mis à jour avec succès');
      fetchPointages();
      return data;
    } catch (err: any) {
      console.error('Error updating pointage:', err);
      setError(err);
      toast.error('Erreur lors de la mise à jour du pointage');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePointage = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pointages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Pointage supprimé avec succès');
      fetchPointages();
      return data;
    } catch (err: any) {
      console.error('Error deleting pointage:', err);
      setError(err);
      toast.error('Erreur lors de la suppression du pointage');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    pointages,
    loading,
    error,
    fetchPointages,
    createPointage,
    updatePointage,
    deletePointage,
  };
};
