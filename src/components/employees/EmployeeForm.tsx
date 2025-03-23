
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EmployeeFormData } from "@/hooks/useEmployeeOperations";
import { Textarea } from "@/components/ui/textarea";

const employerOptions = [
  { value: "phoenix", label: "Phoenix Interim Suarl" },
  { value: "eiffage", label: "Eiffage" },
  { value: "setif", label: "Setif" },
  { value: "afric", label: "Afric Management" },
];

const siteOptions = [
  { value: "dakar", label: "Dakar" },
  { value: "thies", label: "Thies" },
  { value: "kedougou", label: "Kédougou" },
  { value: "tambacounda", label: "Tambacounda" },
  { value: "saintlouis", label: "Saint Louis" },
  { value: "ziguinchor", label: "Ziguinchor" },
];

const employeeFormSchema = z.object({
  matricule: z.string().min(1, { message: "Le matricule est requis" }),
  employeur: z.string().min(1, { message: "L'employeur est requis" }),
  nom: z.string().min(1, { message: "Le nom est requis" }),
  prenom: z.string().min(1, { message: "Le prénom est requis" }),
  date_naissance: z.date({ required_error: "La date de naissance est requise" }),
  poste: z.string().min(1, { message: "Le poste est requis" }),
  adresse: z.string().min(1, { message: "L'adresse est requise" }),
  telephone: z.string().min(1, { message: "Le téléphone est requis" }),
  affectation: z.string().min(1, { message: "L'affectation est requise" }),
  site: z.string().min(1, { message: "Le site est requis" }),
});

interface EmployeeFormProps {
  onSubmit: (values: EmployeeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialValues?: Partial<EmployeeFormData>;
  mode?: "create" | "edit";
}

const EmployeeForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialValues,
  mode = "create"
}: EmployeeFormProps) => {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      matricule: "",
      employeur: "",
      nom: "",
      prenom: "",
      poste: "",
      adresse: "",
      telephone: "",
      affectation: "",
      site: "",
    },
  });

  // Reset form with initialValues when they change
  useEffect(() => {
    if (initialValues) {
      // Reset the form with initial values
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="matricule"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Matricule</FormLabel>
                <FormControl>
                  <Input placeholder="EMP-00001" {...field} className="p-3 text-base h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeur"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Employeur</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="p-3 text-base h-12">
                      <SelectValue placeholder="Sélectionner un employeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employerOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-base">
                        {option.label}
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
            name="nom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de famille" {...field} className="p-3 text-base h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} className="p-3 text-base h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_naissance"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Date de naissance</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full h-12 p-3 text-base text-left font-normal flex justify-between items-center ${
                          !field.value ? "text-muted-foreground" : ""
                        }`}
                      >
                        <span>
                          {field.value ? (
                            format(field.value, "dd MMMM yyyy", { locale: fr })
                          ) : (
                            "Sélectionner une date"
                          )}
                        </span>
                        <CalendarIcon className="ml-auto h-5 w-5" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={fr}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="poste"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Poste</FormLabel>
                <FormControl>
                  <Input placeholder="Poste occupé" {...field} className="p-3 text-base h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Adresse</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Adresse complète" 
                    {...field} 
                    className="p-3 text-base min-h-[5rem] resize-none" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro de téléphone" {...field} className="p-3 text-base h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affectation"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Affectation</FormLabel>
                <FormControl>
                  <Input placeholder="Affectation" {...field} className="p-3 text-base h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Site</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="p-3 text-base h-12">
                      <SelectValue placeholder="Sélectionner un site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {siteOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-base">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel} 
            disabled={isLoading}
            className="px-6 py-2 text-base h-12"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="px-6 py-2 text-base h-12"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeForm;
