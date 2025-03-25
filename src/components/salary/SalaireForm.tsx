
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalaireFormData } from "@/services/salaireService";
import { useSalaires } from "@/hooks/useSalaires";
import { Calculator } from "lucide-react";

const formSchema = z.object({
  matricule: z.string().min(1, "Le matricule est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  periode_paie: z.string().min(1, "La période de paie est requise"),
  salaire_base: z.coerce.number().min(0, "Le salaire de base ne peut pas être négatif"),
  sursalaire: z.coerce.number().min(0, "Le sursalaire ne peut pas être négatif").default(0),
  indemnite_deplacement: z.coerce.number().min(0, "L'indemnité de déplacement ne peut pas être négative").default(0),
  prime_transport: z.coerce.number().min(0, "La prime de transport ne peut pas être négative").default(0),
  retenue_ir: z.coerce.number().min(0, "La retenue IR ne peut pas être négative").default(0),
  ipres_general: z.coerce.number().min(0, "L'IPRES général ne peut pas être négatif").default(0),
  trimf: z.coerce.number().min(0, "Le TRIMF ne peut pas être négatif").default(0),
});

const getCurrentYear = () => new Date().getFullYear();
const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export function SalaireForm() {
  const { createSalaire, isCreating } = useSalaires();
  const [netAPayer, setNetAPayer] = useState<number>(0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matricule: "",
      nom: "",
      periode_paie: "",
      salaire_base: 0,
      sursalaire: 0,
      indemnite_deplacement: 0,
      prime_transport: 0,
      retenue_ir: 0,
      ipres_general: 0,
      trimf: 0,
    },
  });
  
  const currentYear = getCurrentYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  
  const watchAllFields = form.watch();
  
  useEffect(() => {
    const totalBrut = 
      Number(watchAllFields.salaire_base || 0) + 
      Number(watchAllFields.sursalaire || 0) + 
      Number(watchAllFields.indemnite_deplacement || 0) + 
      Number(watchAllFields.prime_transport || 0);
    
    const totalDeductions = 
      Number(watchAllFields.retenue_ir || 0) + 
      Number(watchAllFields.ipres_general || 0) + 
      Number(watchAllFields.trimf || 0);
    
    setNetAPayer(totalBrut - totalDeductions);
  }, [watchAllFields]);
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Add net_a_payer to the form data before submitting
    const formData: SalaireFormData = {
      ...values,
      net_a_payer: netAPayer,
      statut_paiement: 'En attente'
    };
    
    createSalaire(formData);
    form.reset();
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouveau salaire</CardTitle>
        <CardDescription>
          Remplissez le formulaire pour créer un nouveau bulletin de salaire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="matricule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le matricule" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom complet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              
            <FormField
              control={form.control}
              name="periode_paie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Période de paie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une période" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((month) => (
                        years.map((year) => (
                          <SelectItem key={`${month}-${year}`} value={`${month} ${year}`}>
                            {month} {year}
                          </SelectItem>
                        ))
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salaire_base"
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
                
              <FormField
                control={form.control}
                name="sursalaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sursalaire</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="indemnite_deplacement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indemnité de déplacement</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="prime_transport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prime de transport</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="retenue_ir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retenue IR</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="ipres_general"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IPRES Général</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="trimf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TRIMF</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              
            <div className="bg-muted p-4 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                <span className="font-semibold">Net à payer:</span>
              </div>
              <div className="text-xl font-bold">{netAPayer.toLocaleString('fr-FR')} FCFA</div>
            </div>
              
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? "Création en cours..." : "Créer le bulletin de salaire"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
