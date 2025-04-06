
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addBusinessDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Employee } from "@/hooks/useEmployees";
import { mapEmployeesToUI } from "@/types/employee";
import { useAuth } from "@/contexts/AuthContext";

const LeaveFormSchema = z.object({
  employee_id: z.string({
    required_error: "Veuillez sélectionner un employé",
  }),
  start_date: z.date({
    required_error: "Veuillez sélectionner une date de début",
  }),
  end_date: z.date({
    required_error: "Veuillez sélectionner une date de fin",
  }).refine(
    (date, ctx) => {
      const startDate = ctx.parent.start_date;
      return date >= startDate;
    },
    {
      message: "La date de fin doit être postérieure ou égale à la date de début",
    }
  ),
  type: z.string({
    required_error: "Veuillez sélectionner un type de congé",
  }),
  reason: z.string().optional(),
});

type LeaveFormValues = z.infer<typeof LeaveFormSchema>;

interface LeaveRequestFormProps {
  employees: Employee[];
  onSubmit: (values: LeaveFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function LeaveRequestForm({
  employees,
  onSubmit,
  onCancel,
  isLoading,
}: LeaveRequestFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const { user, userRole } = useAuth();

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(LeaveFormSchema),
    defaultValues: {
      employee_id: user?.id || "",
      start_date: date,
      end_date: addBusinessDays(date || new Date(), 5),
      type: "",
      reason: "",
    },
    mode: "onChange", // Enable validation on change
  });

  const mappedEmployees = mapEmployeesToUI(employees);
  
  // Set default employee if available and not already set
  useEffect(() => {
    if (user?.id && !form.getValues("employee_id")) {
      form.setValue("employee_id", user.id);
    } else if (employees.length > 0 && !form.getValues("employee_id")) {
      form.setValue("employee_id", employees[0].id);
    }
  }, [employees, form, user]);

  const showEmployeeField = userRole === 'super_admin';
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {showEmployeeField && (
          <FormField
            control={form.control}
            name="employee_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Employé</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {mappedEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        )}
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-white">Date de début</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-slate-800 border-slate-700 text-white",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > addBusinessDays(new Date(), 90)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-white">Date de fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-slate-800 border-slate-700 text-white",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > addBusinessDays(new Date(), 90)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Type de congé</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="paid">Congé payé</SelectItem>
                  <SelectItem value="unpaid">Congé non payé</SelectItem>
                  <SelectItem value="sick">Congé maladie</SelectItem>
                  <SelectItem value="maternity">Congé maternité</SelectItem>
                  <SelectItem value="paternity">Congé paternité</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Raison (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez la raison de votre demande de congé"
                  className="resize-none bg-slate-800 border-slate-700 text-white"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-slate-400">
                Fournissez une raison pour votre demande de congé.
              </FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700 hover:text-white"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
