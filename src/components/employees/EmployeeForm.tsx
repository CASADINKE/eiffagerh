
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
import { useRemunerationsOperations } from "@/hooks/useRemunerationsOperations";

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

const categoryOptions = [
  { value: "a", label: "Catégorie A" },
  { value: "b", label: "Catégorie B" },
  { value: "c", label: "Catégorie C" },
  { value: "d", label: "Catégorie D" },
  { value: "e", label: "Catégorie E" },
  { value: "f", label: "Catégorie F" },
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
  categorie: z.string().min(1, { message: "La catégorie est requise" }),
  salaire_base: z.string().optional(),
  sursalaire: z.string().optional(),
  prime_deplacement: z.string().optional(),
  commentaire: z.string().optional(),
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
  const { getSalaryByCategory, getDefaultSursalaire, getDefaultDeplacement } = useRemunerationsOperations();
  
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
      categorie: "",
      salaire_base: "",
      sursalaire: "",
      prime_deplacement: "",
      commentaire: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  // Mettre à jour le salaire de base en fonction de la catégorie sélectionnée
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'categorie') {
        const category = value.categorie;
        if (category) {
          // Obtenir le salaire correspondant à la catégorie
          const salaryAmount = getSalaryByCategory(category);
          form.setValue('salaire_base', salaryAmount.toString());
          
          // Obtenir le sursalaire par défaut
          const defaultSursalaire = getDefaultSursalaire();
          if (defaultSursalaire) {
            form.setValue('sursalaire', defaultSursalaire.montant.toString());
          }
          
          // Obtenir l'indemnité de déplacement par défaut
          const defaultDeplacement = getDefaultDeplacement();
          if (defaultDeplacement) {
            form.setValue('prime_deplacement', defaultDeplacement.montant.toString());
          }
        }
      }
    });
    
    // Cleanup de l'effet
    return () => subscription.unsubscribe();
  }, [form, getSalaryByCategory, getDefaultSursalaire, getDefaultDeplacement]);

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
              <FormItem className="flex flex-col md:col-span-2">
                <FormLabel className="text-base mb-1">Date de naissance</FormLabel>
                <div className="bg-muted/10 p-1 border border-primary/10 rounded-md shadow-sm">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full h-12 p-3 text-base text-left font-normal flex justify-between items-center bg-background/95 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                            <span>
                              {field.value ? (
                                format(field.value, "dd MMMM yyyy", { locale: fr })
                              ) : (
                                "Sélectionner une date"
                              )}
                            </span>
                          </div>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border border-primary/20 shadow-md" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={fr}
                        className="rounded-md border-primary/10 pointer-events-auto"
                        disabled={(date) =>
                          date > new Date() || date < new Date("1940-01-01")
                        }
                        fromYear={1940}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown-buttons"
                        showOutsideDays
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-1">
                  Choisissez une date entre 1940 et aujourd'hui
                </p>
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
            name="categorie"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Catégorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="p-3 text-base h-12">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map((option) => (
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
            name="salaire_base"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Salaire de base</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="Ex: 350000" 
                    {...field} 
                    className="p-3 text-base h-12 bg-muted/20"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sursalaire"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Sursalaire</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="Ex: 50000" 
                    {...field} 
                    className="p-3 text-base h-12 bg-muted/20"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prime_deplacement"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Prime de déplacement</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="Ex: 25000" 
                    {...field} 
                    className="p-3 text-base h-12 bg-muted/20"
                    readOnly
                  />
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

          <FormField
            control={form.control}
            name="commentaire"
            render={({ field }) => (
              <FormItem className="flex flex-col md:col-span-2">
                <FormLabel className="text-base">Commentaire</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Commentaire sur les primes ou autres informations complémentaires" 
                    {...field} 
                    className="p-3 text-base min-h-[5rem] resize-none" 
                  />
                </FormControl>
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
            className="px-6 py-2 text-base h-12 border-primary/20 hover:bg-primary/5"
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
