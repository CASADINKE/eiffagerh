
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface Pointage {
  id: string;
  user_id: string;
  date_pointage: string;
  heure_arrivee: string | null;
  heure_depart: string | null;
  duree_travail: string | null;
  remarque: string | null;
  statut: string;
  created_at: string;
  updated_at: string;
}

export const usePointage = () => {
  const [todayPointage, setTodayPointage] = useState<Pointage | null>(null);
  const [historyPointages, setHistoryPointages] = useState<Pointage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [clockInLoading, setClockInLoading] = useState(false);
  const [clockOutLoading, setClockOutLoading] = useState(false);
  const { user } = useAuth();

  const today = format(new Date(), 'yyyy-MM-dd');

  // Calculate work duration
  const calculateWorkDuration = (heureArrivee: string | null, heureDepart: string | null): string => {
    if (!heureArrivee) return "00h 00min";
    
    const startTime = new Date(heureArrivee);
    const endTime = heureDepart ? new Date(heureDepart) : new Date();
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}min`;
  };

  const fetchTodayPointage = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pointages')
        .select('*')
        .eq('user_id', user.id)
        .eq('date_pointage', today)
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
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('pointages')
        .select('*')
        .eq('user_id', user.id)
        .order('date_pointage', { ascending: false });
      
      // Filter by month and year if provided
      if (month !== undefined && year !== undefined) {
        const startDate = format(new Date(year, month, 1), 'yyyy-MM-dd');
        const endDate = format(new Date(year, month + 1, 0), 'yyyy-MM-dd');
        
        query = query
          .gte('date_pointage', startDate)
          .lte('date_pointage', endDate);
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

  const clockIn = async (remarque?: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour pointer");
      return;
    }
    
    if (todayPointage?.heure_arrivee) {
      toast.error("Vous avez déjà pointé l'arrivée aujourd'hui");
      return;
    }
    
    setClockInLoading(true);
    try {
      const now = new Date().toISOString();
      const status = 'automatique';
      
      // Check if a record for today already exists
      if (todayPointage) {
        // Update existing record
        const { data, error } = await supabase
          .from('pointages')
          .update({ 
            heure_arrivee: now,
            statut: status,
            remarque: remarque
          })
          .eq('id', todayPointage.id)
          .select()
          .single();

        if (error) throw error;
        setTodayPointage(data);
      } else {
        // Create new record
        const newPointage = {
          user_id: user.id,
          date_pointage: today,
          heure_arrivee: now,
          statut: status,
          remarque: remarque
        };
        
        const { data, error } = await supabase
          .from('pointages')
          .insert([newPointage])
          .select()
          .single();

        if (error) throw error;
        setTodayPointage(data);
      }
      
      toast.success("Pointage d'arrivée enregistré avec succès");
    } catch (err: any) {
      console.error('Error clocking in:', err);
      setError(err);
      toast.error("Erreur lors du pointage d'arrivée");
    } finally {
      setClockInLoading(false);
    }
  };

  const clockOut = async (remarque?: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour pointer");
      return;
    }
    
    if (!todayPointage?.id) {
      toast.error("Vous n'avez pas encore pointé l'arrivée aujourd'hui");
      return;
    }
    
    if (todayPointage?.heure_depart) {
      toast.error("Vous avez déjà pointé le départ aujourd'hui");
      return;
    }
    
    setClockOutLoading(true);
    try {
      const now = new Date().toISOString();
      
      // Calculate duration
      const duration = calculateWorkDuration(todayPointage.heure_arrivee, now);
      
      // Update with departure time and duration
      const { data, error } = await supabase
        .from('pointages')
        .update({ 
          heure_depart: now,
          duree_travail: duration,
          remarque: remarque || todayPointage.remarque
        })
        .eq('id', todayPointage.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayPointage(data);
      toast.success("Pointage de départ enregistré avec succès");
    } catch (err: any) {
      console.error('Error clocking out:', err);
      setError(err);
      toast.error("Erreur lors du pointage de départ");
    } finally {
      setClockOutLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTodayPointage();
      fetchHistoryPointages();
    }
  }, [user]);

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
