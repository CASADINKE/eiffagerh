
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { CalendarComponent } from "@/components/ui/calendar";
import {
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "./PaymentFormSchema";

interface PaymentFormFieldsProps {
  form: UseFormReturn<PaymentFormValues>;
}

export function PaymentFormFields({ form }: PaymentFormFieldsProps) {
  return (
    <>
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
    </>
  );
}
