
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

const paymentFormSchema = z.object({
  period: z.string().min(1, { message: "La période est requise" }),
  paymentDate: z.date({
    required_error: "La date de paiement est requise",
  }),
  paymentMethod: z.string().min(1, { message: "La méthode de paiement est requise" }),
  description: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function SalaryPaymentDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues: Partial<PaymentFormValues> = {
    period: format(new Date(), "MMMM yyyy"),
    paymentDate: new Date(),
    paymentMethod: "virement",
    description: "",
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setLoading(true);
    
    try {
      // Here you would integrate with your backend to process the payment
      console.log("Processing payment:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Paiement des salaires effectué avec succès!");
      setOpen(false);
      form.reset(defaultValues);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Erreur lors du paiement des salaires");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Calendar className="h-4 w-4" />
          <span>Paiement Salaire</span>
        </Button>
      </DialogTrigger>
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
              name="period"
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
              name="paymentDate"
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
              name="paymentMethod"
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
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Traitement..." : "Effectuer le paiement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
