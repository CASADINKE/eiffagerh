
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createBulletinPaie } from "@/services/payslipService";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddPayslipForm() {
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [periode_paie, setPeriodePaie] = useState("");
  const [salaire_base, setSalaireBase] = useState("");
  const [sursalaire, setSursalaire] = useState("");
  const [indemnite_deplacement, setIndemnite] = useState("");
  const [retenue_ir, setRetenueIR] = useState("");
  const [ipres_general, setIpres] = useState("");
  const [trimf, setTrimf] = useState("");
  const [prime_transport, setPrimeTransport] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculer le total brut à partir des champs saisis
  const calculateTotalBrut = () => {
    const base = parseFloat(salaire_base) || 0;
    const sur = parseFloat(sursalaire) || 0;
    const indem = parseFloat(indemnite_deplacement) || 0;
    const prime = parseFloat(prime_transport) || 0;
    
    return base + sur + indem + prime;
  };

  // Calculer le net à payer à partir des champs saisis
  const calculateNetAPayer = () => {
    const totalBrut = calculateTotalBrut();
    const ir = parseFloat(retenue_ir) || 0;
    const ipres = parseFloat(ipres_general) || 0;
    const tr = parseFloat(trimf) || 0;
    
    return totalBrut - ir - ipres - tr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Calculer les valeurs totales
      const total_brut = calculateTotalBrut();
      const net_a_payer = calculateNetAPayer();
      
      // Créer l'objet bulletinPaie avec les bonnes propriétés
      const bulletinPaie = {
        matricule,
        nom,
        periode_paie,
        salaire_base: parseFloat(salaire_base) || 0,
        sursalaire: parseFloat(sursalaire) || 0,
        indemnite_deplacement: parseFloat(indemnite_deplacement) || 0,
        retenue_ir: parseFloat(retenue_ir) || 0,
        ipres_general: parseFloat(ipres_general) || 0,
        trimf: parseFloat(trimf) || 0,
        prime_transport: parseFloat(prime_transport) || 0,
        total_brut,
        net_a_payer
      };
      
      // Utiliser la fonction du service payslip pour créer le bulletin
      const success = await createBulletinPaie(bulletinPaie);
      
      if (success) {
        // Réinitialiser le formulaire après succès
        setMatricule("");
        setNom("");
        setPeriodePaie("");
        setSalaireBase("");
        setSursalaire("");
        setIndemnite("");
        setRetenueIR("");
        setIpres("");
        setTrimf("");
        setPrimeTransport("");
        toast.success("Bulletin de paie ajouté avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du bulletin:", error);
      toast.error("Erreur lors de l'ajout du bulletin de paie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Ajouter un Bulletin de Paie</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricule">Matricule</Label>
              <Input 
                id="matricule"
                placeholder="Matricule" 
                value={matricule} 
                onChange={(e) => setMatricule(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input 
                id="nom"
                placeholder="Nom de l'employé" 
                value={nom} 
                onChange={(e) => setNom(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periode">Période de Paie</Label>
              <Input 
                id="periode"
                placeholder="Ex: Juin 2024" 
                value={periode_paie} 
                onChange={(e) => setPeriodePaie(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaire_base">Salaire de Base</Label>
              <Input 
                id="salaire_base"
                type="number" 
                placeholder="Salaire de Base" 
                value={salaire_base} 
                onChange={(e) => setSalaireBase(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sursalaire">Sursalaire</Label>
              <Input 
                id="sursalaire"
                type="number" 
                placeholder="Sursalaire" 
                value={sursalaire} 
                onChange={(e) => setSursalaire(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="indemnite">Indemnité de Déplacement</Label>
              <Input 
                id="indemnite"
                type="number" 
                placeholder="Indemnité de Déplacement" 
                value={indemnite_deplacement} 
                onChange={(e) => setIndemnite(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retenue_ir">Retenue IR</Label>
              <Input 
                id="retenue_ir"
                type="number" 
                placeholder="Retenue IR" 
                value={retenue_ir} 
                onChange={(e) => setRetenueIR(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ipres">IPRES Général</Label>
              <Input 
                id="ipres"
                type="number" 
                placeholder="IPRES Général" 
                value={ipres_general} 
                onChange={(e) => setIpres(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trimf">TRIMF</Label>
              <Input 
                id="trimf"
                type="number" 
                placeholder="TRIMF" 
                value={trimf} 
                onChange={(e) => setTrimf(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prime">Prime de Transport</Label>
              <Input 
                id="prime"
                type="number" 
                placeholder="Prime de Transport" 
                value={prime_transport} 
                onChange={(e) => setPrimeTransport(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Total Brut:</span>
              <span className="font-bold text-lg">{calculateTotalBrut().toLocaleString()} FCFA</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Net à Payer:</span>
              <span className="font-bold text-lg text-green-600">{calculateNetAPayer().toLocaleString()} FCFA</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Traitement en cours..." : "Ajouter le bulletin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
