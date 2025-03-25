
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
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentMethod, Payslip } from "@/services/payslipService";
import { toast } from "sonner";

export default function ValidateSalary() {
  const [salaries, setSalaries] = useState<Payslip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<Record<string, PaymentMethod | ''>>({});

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bulletins_paie")
      .select("*")
      .eq("statut_paiement", "En attente");
    
    if (!error) {
      setSalaries(data as Payslip[]);
    } else {
      console.error("Error fetching salaries:", error);
      toast.error("Erreur lors de la récupération des données");
    }
    setIsLoading(false);
  };

  const handlePaymentMethodChange = (id: string, value: string) => {
    setPaymentMethods({
      ...paymentMethods,
      [id]: value as PaymentMethod
    });
  };

  const validatePayment = async (id: string, paymentMethod: PaymentMethod) => {
    try {
      const { error } = await supabase
        .from("bulletins_paie")
        .update({ 
          statut_paiement: "Payé", 
          mode_paiement: paymentMethod, 
          date_paiement: new Date().toISOString().split('T')[0]
        })
        .eq("id", id);

      if (error) {
        throw error;
      }
      
      toast.success("Paiement validé avec succès !");
      fetchSalaries();
    } catch (error) {
      console.error("Error validating payment:", error);
      toast.error("Erreur lors de la validation du paiement");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Validation des Paiements</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulletins en attente de paiement</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">Chargement des données...</div>
          ) : salaries.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Aucun bulletin de paie en attente
            </div>
          ) : (
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
                {salaries.map((salary) => (
                  <TableRow key={salary.id}>
                    <TableCell>{salary.nom}</TableCell>
                    <TableCell>{salary.periode_paie}</TableCell>
                    <TableCell>{salary.net_a_payer.toLocaleString('fr-FR')} FCFA</TableCell>
                    <TableCell>
                      <Select 
                        value={paymentMethods[salary.id] || ''} 
                        onValueChange={(value) => handlePaymentMethodChange(salary.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Choisir un mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Virement">Virement</SelectItem>
                          <SelectItem value="Espèces">Espèces</SelectItem>
                          <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        disabled={!paymentMethods[salary.id]}
                        onClick={() => validatePayment(salary.id, paymentMethods[salary.id] as PaymentMethod)}
                      >
                        Valider
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
