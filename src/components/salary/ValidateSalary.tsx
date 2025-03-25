
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PaymentMethod } from "@/services/payslipService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CreditCard, Wallet } from "lucide-react";

interface Salary {
  id: string;
  nom: string;
  periode_paie: string;
  net_a_payer: number;
  statut_paiement: string;
  mode_paiement: PaymentMethod | null;
  date_paiement: string | null;
}

export default function ValidateSalary() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<Record<string, PaymentMethod | ''>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bulletins_paie")
      .select("*")
      .eq("statut_paiement", "En attente");
      
    if (error) {
      toast.error("Erreur lors du chargement des salaires: " + error.message);
    } else {
      setSalaries(data as Salary[]);
      
      // Initialize payment methods state
      const methods: Record<string, PaymentMethod | ''> = {};
      data.forEach((salary: Salary) => {
        methods[salary.id] = '';
      });
      setPaymentMethods(methods);
    }
    setIsLoading(false);
  };

  const handlePaymentMethodChange = (id: string, method: PaymentMethod) => {
    setPaymentMethods(prev => ({
      ...prev,
      [id]: method
    }));
  };

  const validatePayment = async (id: string) => {
    const selectedMethod = paymentMethods[id];
    
    if (!selectedMethod) {
      toast.error("Veuillez sélectionner un mode de paiement");
      return;
    }
    
    const { error } = await supabase
      .from("bulletins_paie")
      .update({ 
        statut_paiement: "Payé", 
        mode_paiement: selectedMethod, 
        date_paiement: new Date().toISOString().split('T')[0]
      })
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la validation du paiement: " + error.message);
    } else {
      toast.success("Salaire payé avec succès !");
      fetchSalaries();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validation des Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Net à Payer</TableHead>
              <TableHead>Mode de Paiement</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Chargement...</TableCell>
              </TableRow>
            ) : salaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Aucun salaire en attente de validation</TableCell>
              </TableRow>
            ) : (
              salaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell>{salary.nom}</TableCell>
                  <TableCell>{salary.periode_paie}</TableCell>
                  <TableCell>{salary.net_a_payer.toLocaleString('fr-FR')} FCFA</TableCell>
                  <TableCell>
                    <Select
                      value={paymentMethods[salary.id]}
                      onValueChange={(value) => handlePaymentMethodChange(salary.id, value as PaymentMethod)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Mode de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Virement">
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Virement</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Espèces">
                          <div className="flex items-center">
                            <Banknote className="mr-2 h-4 w-4" />
                            <span>Espèces</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Mobile Money">
                          <div className="flex items-center">
                            <Wallet className="mr-2 h-4 w-4" />
                            <span>Mobile Money</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => validatePayment(salary.id)}
                      disabled={!paymentMethods[salary.id]}
                    >
                      Valider
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
