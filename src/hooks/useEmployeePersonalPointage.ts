
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

export interface EmployeePersonalPointage {
  id: string;
  employee_id: string;
  clock_in: string | null;
  clock_out: string | null;
  date: string;
  break_time: number;
}

export const useEmployeePersonalPointage = (employeeId: string) => {
  const [todayPointage, setTodayPointage] = useState<EmployeePersonalPointage | null>(null);
  const [historyPointages, setHistoryPointages] = useState<EmployeePersonalPointage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [clockInLoading, setClockInLoading] = useState(false);
  const [clockOutLoading, setClockOutLoading] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  // Calculate work duration
  const calculateWorkDuration = (clockIn: string | null, clockOut: string | null): string => {
    if (!clockIn) return "00h 00min";
    
    const startTime = new Date(clockIn);
    const endTime = clockOut ? new Date(clockOut) : new Date();
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}min`;
  };

  const fetchTodayPointage = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      
      setTodayPointage(data);
    } catch (err: any) {
      console.error('Error fetching today pointage:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryPointages = async (month?: number, year?: number) => {
    setLoading(true);
    try {
      let query = supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', employeeId)
        .order('date', { ascending: false });
      
      // Filter by month and year if provided
      if (month !== undefined && year !== undefined) {
        const startDate = format(new Date(year, month, 1), 'yyyy-MM-dd');
        const endDate = format(new Date(year, month + 1, 0), 'yyyy-MM-dd');
        
        query = query
          .gte('date', startDate)
          .lte('date', endDate);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      setHistoryPointages(data || []);
    } catch (err: any) {
      console.error('Error fetching history pointages:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const clockIn = async () => {
    if (todayPointage?.clock_in) {
      toast.error("Vous avez déjà pointé l'entrée aujourd'hui");
      return;
    }
    
    setClockInLoading(true);
    try {
      const newPointage = {
        employee_id: employeeId,
        date: today,
        clock_in: new Date().toISOString(),
        break_time: 0
      };
      
      const { data, error } = await supabase
        .from('time_entries')
        .insert([newPointage])
        .select()
        .single();

      if (error) throw error;
      
      setTodayPointage(data);
      toast.success("Pointage d'entrée enregistré avec succès");
    } catch (err: any) {
      console.error('Error clocking in:', err);
      setError(err);
      toast.error("Erreur lors du pointage d'entrée");
    } finally {
      setClockInLoading(false);
    }
  };

  const clockOut = async () => {
    if (!todayPointage?.id) {
      toast.error("Vous n'avez pas encore pointé l'entrée aujourd'hui");
      return;
    }
    
    if (todayPointage?.clock_out) {
      toast.error("Vous avez déjà pointé la sortie aujourd'hui");
      return;
    }
    
    setClockOutLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', todayPointage.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayPointage(data);
      toast.success("Pointage de sortie enregistré avec succès");
    } catch (err: any) {
      console.error('Error clocking out:', err);
      setError(err);
      toast.error("Erreur lors du pointage de sortie");
    } finally {
      setClockOutLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchTodayPointage();
      fetchHistoryPointages();
    }
  }, [employeeId]);

  return {
    todayPointage,
    historyPointages,
    loading,
    error,
    clockIn,
    clockOut,
    fetchTodayPointage,
    fetchHistoryPointages,
    calculateWorkDuration,
    clockInLoading,
    clockOutLoading
  };
};
