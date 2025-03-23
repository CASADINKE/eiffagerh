
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { createSalaryPayment } from "@/services/salaryPaymentService";

const paymentFormSchema = z.object({
  payment_period: z.string().min(1, { message: "La période est requise" }),
  payment_date: z.date({
    required_error: "La date de paiement est requise",
  }),
  payment_method: z.string().min(1, { message: "La méthode de paiement est requise" }),
  description: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface SalaryPaymentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SalaryPaymentDialog({ open, onOpenChange }: SalaryPaymentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use either controlled or uncontrolled state
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const defaultValues: Partial<PaymentFormValues> = {
    payment_period: format(new Date(), "MMMM yyyy"),
    payment_date: new Date(),
    payment_method: "virement",
    description: "",
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setLoading(true);
    
    try {
      const paymentId = await createSalaryPayment({
        payment_period: data.payment_period,
        payment_date: format(data.payment_date, 'yyyy-MM-dd'),
        payment_method: data.payment_method,
        description: data.description || null,
        total_amount: 0, // This will be updated when payslips are generated
        status: 'pending'
      });
      
      if (paymentId) {
        toast.success("Paiement des salaires créé avec succès!");
        setIsOpen(false);
        form.reset(defaultValues);
        navigate(`/salary-payment/${paymentId}`);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Erreur lors du paiement des salaires");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2" onClick={() => setIsOpen(true)}>
            <Calendar className="h-4 w-4" />
            <span>Paiement Salaire</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Paiement des salaires</DialogTitle>
          <DialogDescription>
            Processus de paiement des salaires pour tous les employés
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="payment_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Période de paie</FormLabel>
                  <FormControl>
                    <Input placeholder="Mai 2024" {...field} />
                  </FormControl>
                  <FormDescription>
                    La période pour laquelle les salaires sont payés
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de paiement</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Date à laquelle le paiement sera effectué
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une méthode de paiement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="virement">Virement bancaire</SelectItem>
                      <SelectItem value="cheque">Chèque</SelectItem>
                      <SelectItem value="especes">Espèces</SelectItem>
                      <SelectItem value="mobile">Paiement mobile</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Méthode utilisée pour effectuer le paiement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Notes additionnelles" {...field} />
                  </FormControl>
                  <FormDescription>
                    Informations supplémentaires concernant le paiement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Traitement..." : "Créer le paiement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
