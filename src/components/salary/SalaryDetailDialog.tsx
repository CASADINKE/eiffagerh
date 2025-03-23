
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SalaryDetail } from "@/services/salaryDetailsService";
import { useEmployees } from "@/hooks/useEmployees";
import { useCreateSalaryDetail, useUpdateSalaryDetail } from "@/hooks/useSalaryDetails";
import { toast } from "sonner";

const salaryDetailSchema = z.object({
  employee_id: z.string().uuid("Veuillez sélectionner un employé"),
  base_salary: z.coerce.number().min(0, "Le salaire de base doit être positif"),
  contract_type: z.string().min(1, "Veuillez sélectionner un type de contrat"),
  pay_grade: z.string().optional().nullable(),
  currency: z.string().min(1, "Veuillez sélectionner une devise"),
  payment_frequency: z.string().min(1, "Veuillez sélectionner une fréquence de paiement"),
  tax_rate: z.coerce.number().min(0, "Le taux d'imposition doit être positif").max(1, "Le taux d'imposition doit être inférieur à 100%").optional().nullable(),
});

type SalaryDetailFormValues = z.infer<typeof salaryDetailSchema>;

interface SalaryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salaryDetail: SalaryDetail | null;
}

export function SalaryDetailDialog({ open, onOpenChange, salaryDetail }: SalaryDetailDialogProps) {
  const [loading, setLoading] = useState(false);
  const { data: employees } = useEmployees();
  const createSalaryDetail = useCreateSalaryDetail();
  const updateSalaryDetail = useUpdateSalaryDetail();

  const isEditing = !!salaryDetail;

  const form = useForm<SalaryDetailFormValues>({
    resolver: zodResolver(salaryDetailSchema),
    defaultValues: {
      employee_id: "",
      base_salary: 0,
      contract_type: "CDI",
      pay_grade: null,
      currency: "FCFA",
      payment_frequency: "monthly",
      tax_rate: 0.15,
    },
  });

  useEffect(() => {
    if (salaryDetail) {
      form.reset({
        employee_id: salaryDetail.employee_id,
        base_salary: salaryDetail.base_salary,
        contract_type: salaryDetail.contract_type,
        pay_grade: salaryDetail.pay_grade,
        currency: salaryDetail.currency,
        payment_frequency: salaryDetail.payment_frequency,
        tax_rate: salaryDetail.tax_rate,
      });
    }
  }, [salaryDetail, form]);

  const onSubmit = async (data: SalaryDetailFormValues) => {
    setLoading(true);
    
    try {
      if (isEditing && salaryDetail) {
        await updateSalaryDetail.mutateAsync({ 
          id: salaryDetail.id, 
          data 
        });
        toast.success("Détail de salaire mis à jour avec succès");
      } else {
        await createSalaryDetail.mutateAsync(data);
        toast.success("Détail de salaire créé avec succès");
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting salary detail:", error);
      toast.error("Erreur lors de l'enregistrement du détail de salaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le détail de salaire" : "Ajouter un détail de salaire"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifiez les informations du détail de salaire ci-dessous."
              : "Remplissez les informations du détail de salaire ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="employee_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un employé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="base_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire de base</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de contrat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CDI">CDI</SelectItem>
                        <SelectItem value="CDD">CDD</SelectItem>
                        <SelectItem value="Stage">Stage</SelectItem>
                        <SelectItem value="Consultant">Consultant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pay_grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FCFA">FCFA</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fréquence de paiement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une fréquence" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="biweekly">Bimensuel</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tax_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux d'imposition (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={field.value !== null ? field.value * 100 : ''} 
                      onChange={e => {
                        const value = e.target.value ? parseFloat(e.target.value) / 100 : null;
                        field.onChange(value);
                      }} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Traitement..." : isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
