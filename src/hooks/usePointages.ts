
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

export interface Pointage {
  id: string;
  user_id: string;
  date: string;
  heure_entree: string | null;
  heure_sortie: string | null;
  statut: 'present' | 'en_retard' | 'absent';
  created_at: string;
  updated_at: string;
}

export interface HoraireReference {
  id: string;
  user_id: string;
  heure_debut: string;
  heure_fin: string;
  created_at: string;
  updated_at: string;
}

export const usePointages = (userId: string) => {
  const [todayPointage, setTodayPointage] = useState<Pointage | null>(null);
  const [historyPointages, setHistoryPointages] = useState<Pointage[]>([]);
  const [horaireReference, setHoraireReference] = useState<HoraireReference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [clockInLoading, setClockInLoading] = useState(false);
  const [clockOutLoading, setClockOutLoading] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  // Calculate work duration
  const calculateWorkDuration = (heureEntree: string | null, heureSortie: string | null): string => {
    if (!heureEntree) return "00h 00min";
    
    const startTime = new Date(heureEntree);
    const endTime = heureSortie ? new Date(heureSortie) : new Date();
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}min`;
  };

  const determineStatus = (entryTime: string | null, referenceTime: string | null): 'present' | 'en_retard' | 'absent' => {
    if (!entryTime) return 'absent';
    if (!referenceTime) return 'present'; // No reference time, consider present

    const entryDate = new Date(entryTime);
    // Reference time comes as HH:MM, we need to create a date object with today's date
    const [hours, minutes] = referenceTime.split(':').map(Number);
    const referenceDate = new Date();
    referenceDate.setHours(hours, minutes, 0, 0);

    // If entry time is after reference time + 15 minutes, consider late
    const lateThreshold = new Date(referenceDate.getTime() + 15 * 60 * 1000);
    
    return entryDate > lateThreshold ? 'en_retard' : 'present';
  };

  const fetchTodayPointage = async () => {
    setLoading(true);
    try {
      // Using any type to bypass type checking since we know the table exists
      const { data, error } = await supabase
        .from('pointages' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      
      setTodayPointage(data as unknown as Pointage);
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
      // Using any type to bypass type checking
      let query = supabase
        .from('pointages' as any)
        .select('*')
        .eq('user_id', userId)
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
      
      setHistoryPointages(data as unknown as Pointage[] || []);
    } catch (err: any) {
      console.error('Error fetching history pointages:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHoraireReference = async () => {
    try {
      // Using any type to bypass type checking
      const { data, error } = await supabase
        .from('horaires_reference' as any)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      setHoraireReference(data as unknown as HoraireReference);
    } catch (err: any) {
      console.error('Error fetching horaire reference:', err);
      // Not setting error state here as this is not critical
    }
  };

  const clockIn = async () => {
    if (todayPointage?.heure_entree) {
      toast.error("Vous avez déjà pointé l'entrée aujourd'hui");
      return;
    }
    
    setClockInLoading(true);
    try {
      const now = new Date().toISOString();
      let status = 'present';
      
      // Determine status based on reference hours if available
      if (horaireReference?.heure_debut) {
        status = determineStatus(now, horaireReference.heure_debut);
      }
      
      // Check if a record for today already exists
      if (todayPointage) {
        // Update existing record
        const { data, error } = await supabase
          .from('pointages' as any)
          .update({ 
            heure_entree: now,
            statut: status
          })
          .eq('id', todayPointage.id)
          .select()
          .single();

        if (error) throw error;
        setTodayPointage(data as unknown as Pointage);
      } else {
        // Create new record
        const newPointage = {
          user_id: userId,
          date: today,
          heure_entree: now,
          statut: status
        };
        
        const { data, error } = await supabase
          .from('pointages' as any)
          .insert([newPointage])
          .select()
          .single();

        if (error) throw error;
        setTodayPointage(data as unknown as Pointage);
      }
      
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
    
    if (todayPointage?.heure_sortie) {
      toast.error("Vous avez déjà pointé la sortie aujourd'hui");
      return;
    }
    
    setClockOutLoading(true);
    try {
      const { data, error } = await supabase
        .from('pointages' as any)
        .update({ heure_sortie: new Date().toISOString() })
        .eq('id', todayPointage.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayPointage(data as unknown as Pointage);
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
    if (userId) {
      fetchTodayPointage();
      fetchHistoryPointages();
      fetchHoraireReference();
    }
  }, [userId]);

  return {
    todayPointage,
    historyPointages,
    horaireReference,
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
