
import { useState, useEffect } from 'react';
import { Remuneration } from '@/pages/GestionRemunerations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type RemunerationsStats = {
  salaryTrend: number;
  totalSalaryMass: number;
};

export const useRemunerationsOperations = () => {
  const [salaires, setSalaires] = useState<Remuneration[]>([]);
  const [sursalaires, setSursalaires] = useState<Remuneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<RemunerationsStats | null>(null);

  // Mock data for demonstration
  const mockSalaires: Remuneration[] = [
    { id: "1", nom: "Salaire de base - Catégorie A", montant: 350000, description: "Salaire mensuel pour les employés de catégorie A", type: 'salaire', categorie: 'a' },
    { id: "2", nom: "Salaire de base - Catégorie B", montant: 250000, description: "Salaire mensuel pour les employés de catégorie B", type: 'salaire', categorie: 'b' },
    { id: "3", nom: "Salaire de base - Catégorie C", montant: 180000, description: "Salaire mensuel pour les employés de catégorie C", type: 'salaire', categorie: 'c' },
  ];
  
  const mockSursalaires: Remuneration[] = [
    { id: "1", nom: "Prime d'ancienneté", montant: 50000, description: "Prime accordée après 5 ans d'ancienneté", type: 'sursalaire' },
    { id: "2", nom: "Prime de performance", montant: 75000, description: "Prime trimestrielle basée sur les objectifs atteints", type: 'sursalaire' },
    { id: "3", nom: "Indemnité de déplacement", montant: 30000, description: "Compensation mensuelle pour les déplacements professionnels", type: 'sursalaire' },
  ];

  // Load data - for now using mock data, but can be replaced with actual API/Supabase calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API/DB delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // TODO: Replace with actual DB calls when backend is ready
        setSalaires(mockSalaires);
        setSursalaires(mockSursalaires);
        
        // Set mock stats
        setStats({
          salaryTrend: 2.5,
          totalSalaryMass: 25430000
        });
      } catch (error) {
        console.error('Error fetching remunerations:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a new remuneration
  const addRemuneration = async (data: Omit<Remuneration, 'id'>): Promise<void> => {
    // For now, create a mock ID
    const newId = Date.now().toString();
    const newItem: Remuneration = { 
      ...data,
      id: newId
    };
    
    if (data.type === 'salaire') {
      setSalaires(prev => [...prev, newItem]);
    } else {
      setSursalaires(prev => [...prev, newItem]);
    }
    
    // TODO: Replace with actual DB call
    return Promise.resolve();
  };

  // Update an existing remuneration
  const updateRemuneration = async (data: Remuneration): Promise<void> => {
    if (data.type === 'salaire') {
      setSalaires(prev => 
        prev.map(item => item.id === data.id ? data : item)
      );
    } else {
      setSursalaires(prev => 
        prev.map(item => item.id === data.id ? data : item)
      );
    }
    
    // TODO: Replace with actual DB call
    return Promise.resolve();
  };

  // Delete a remuneration
  const deleteRemuneration = async (id: string): Promise<void> => {
    // Check both collections
    let found = false;
    
    setSalaires(prev => {
      const filtered = prev.filter(item => item.id !== id);
      found = filtered.length !== prev.length;
      return filtered;
    });
    
    if (!found) {
      setSursalaires(prev => {
        const filtered = prev.filter(item => item.id !== id);
        return filtered;
      });
    }
    
    // TODO: Replace with actual DB call
    return Promise.resolve();
  };

  return {
    salaires,
    sursalaires,
    isLoading,
    stats,
    addRemuneration,
    updateRemuneration,
    deleteRemuneration
  };
};
