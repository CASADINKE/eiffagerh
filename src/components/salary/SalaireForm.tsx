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
import { useEmployees } from "@/hooks/useEmployees";
import { useRemunerationsOperations } from "@/hooks/useRemunerationsOperations";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  employee: z.string().min(1, "Sélectionnez un employé"),
  periode_paie: z.string().min(1, "La période de paie est requise"),
  categorie: z.string().optional(),
  salaire_base: z.coerce.number().min(0, "Le salaire de base ne peut pas être négatif"),
  sursalaire: z.coerce.number().min(0, "Le sursalaire ne peut pas être négatif").default(0),
  indemnite_deplacement: z.coerce.number().min(0, "L'indemnité de déplacement ne peut pas être négative").default(0),
  prime_transport: z.coerce.number().min(0, "La prime de transport ne peut pas être négative").default(0),
  retenue_ir: z.coerce.number().min(0, "La retenue IR ne peut pas être négative").default(0),
  ipres_general: z.coerce.number().min(0, "L'IPRES général ne peut pas être négatif").default(0),
  trimf: z.coerce.number().min(0, "Le TRIMF ne peut pas être négatif").default(0),
});

// Create a type that matches the Zod schema
type FormValues = z.infer<typeof formSchema>;

const getCurrentYear = () => new Date().getFullYear();
const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export function SalaireForm() {
  const { createSalaire, isCreating } = useSalaires();
  const { data: employees } = useEmployees();
  const { 
    salaires, 
    sursalaires, 
    getSalaryByCategory, 
    getDefaultSursalaire, 
    getDefaultDeplacement 
  } = useRemunerationsOperations();
  
  const [netAPayer, setNetAPayer] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<{ matricule: string; nom: string; prenom: string; salary?: number; categorie?: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingSalaryData, setIsLoadingSalaryData] = useState(false);
  
  // Get the current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee: "",
      periode_paie: "",
      categorie: "",
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
  
  // Update salary base and sursalaire when category changes
  useEffect(() => {
    const categorie = form.watch("categorie");
    if (categorie) {
      // Set base salary based on category
      const baseSalary = getSalaryByCategory(categorie);
      form.setValue('salaire_base', baseSalary);
      
      // Set default sursalaire
      const defaultSursalaire = getDefaultSursalaire();
      if (defaultSursalaire) {
        form.setValue('sursalaire', defaultSursalaire.montant);
      }
      
      // Set default indemnité déplacement
      const defaultDeplacement = getDefaultDeplacement();
      if (defaultDeplacement) {
        form.setValue('indemnite_deplacement', defaultDeplacement.montant);
      }
    }
  }, [form.watch("categorie"), getSalaryByCategory, getDefaultSursalaire, getDefaultDeplacement]);
  
  // Fetch salary details when employee is selected
  const fetchEmployeeSalaryData = async (employeeId: string) => {
    if (!employeeId) return;
    
    setIsLoadingSalaryData(true);
    try {
      // First try to get salary from salary_details table
      const { data: salaryData, error: salaryError } = await supabase
        .from('salary_details')
        .select('*')
        .eq('employee_id', employeeId)
        .maybeSingle();
      
      if (salaryError) {
        console.error("Error fetching salary details:", salaryError);
      }
      
      // If we have salary data from the salary_details table
      if (salaryData) {
        // If there's a pay_grade that matches our categories, set it
        if (salaryData.pay_grade && ['a', 'b', 'c'].includes(salaryData.pay_grade.toLowerCase())) {
          form.setValue('categorie', salaryData.pay_grade.toLowerCase());
        }
        
        // Try to get sursalaire from the most recent salary record
        const { data: lastSalaire, error: lastSalaireError } = await supabase
          .from('salaires')
          .select('*')
          .eq('matricule', selectedEmployee?.matricule || '')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (!lastSalaireError && lastSalaire) {
          form.setValue('sursalaire', lastSalaire.sursalaire || 0);
        }
        
        return;
      }
      
      // Fallback: check if the employee has a previous salary record
      if (selectedEmployee?.matricule) {
        const { data: lastSalaire, error: lastSalaireError } = await supabase
          .from('salaires')
          .select('*')
          .eq('matricule', selectedEmployee.matricule)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (lastSalaireError) {
          console.error("Error fetching last salary:", lastSalaireError);
        }
        
        if (lastSalaire) {
          form.setValue('sursalaire', lastSalaire.sursalaire || 0);
          form.setValue('prime_transport', lastSalaire.prime_transport || 0);
          form.setValue('indemnite_deplacement', lastSalaire.indemnite_deplacement || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching employee salary data:", error);
    } finally {
      setIsLoadingSalaryData(false);
    }
  };
  
  // Update employee info when selection changes
  useEffect(() => {
    const employeeId = form.getValues().employee;
    if (employeeId && employees) {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        setSelectedEmployee({
          matricule: employee.matricule,
          nom: employee.nom,
          prenom: employee.prenom
        });
        
        // Fetch and set salary data
        fetchEmployeeSalaryData(employeeId);
      }
    }
  }, [form.watch("employee"), employees]);
  
  // Calculate net pay whenever form values change
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
  
  function onSubmit(values: FormValues) {
    // Check that employee is selected
    if (!selectedEmployee) {
      console.error("Aucun employé sélectionné");
      return;
    }
    
    // Create a properly typed SalaireFormData object with all required fields
    const formData: SalaireFormData = {
      matricule: selectedEmployee.matricule,
      nom: `${selectedEmployee.prenom} ${selectedEmployee.nom}`,
      periode_paie: values.periode_paie,
      salaire_base: values.salaire_base,
      sursalaire: values.sursalaire,
      indemnite_deplacement: values.indemnite_deplacement,
      prime_transport: values.prime_transport,
      retenue_ir: values.retenue_ir,
      ipres_general: values.ipres_general,
      trimf: values.trimf,
      net_a_payer: netAPayer,
      statut_paiement: 'En attente',
      user_id: userId || undefined
    };
    
    console.log("Création du salaire avec les données:", formData);
    createSalaire(formData);
    form.reset();
    setSelectedEmployee(null);
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
            <FormField
              control={form.control}
              name="employee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un employé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.matricule} - {employee.prenom} {employee.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedEmployee && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">Employé sélectionné:</p>
                <p className="text-sm">Matricule: {selectedEmployee.matricule}</p>
                <p className="text-sm">Nom: {selectedEmployee.prenom} {selectedEmployee.nom}</p>
                {isLoadingSalaryData && <p className="text-sm italic">Chargement des données salariales...</p>}
              </div>
            )}
              
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
            
            <FormField
              control={form.control}
              name="categorie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie salariale</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="a">Catégorie A</SelectItem>
                      <SelectItem value="b">Catégorie B</SelectItem>
                      <SelectItem value="c">Catégorie C</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Le choix de la catégorie détermine automatiquement le salaire de base et le sursalaire
                  </FormDescription>
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
                      <Input 
                        type="number" 
                        {...field}
                        disabled={!!form.watch("categorie")}
                        className={!!form.watch("categorie") ? "bg-muted" : ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch("categorie") && "Calculé en fonction de la catégorie"}
                    </FormDescription>
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
                      <Input 
                        type="number" 
                        {...field}
                        className={!!form.watch("categorie") ? "bg-muted/50" : ""}
                      />
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
                      <Input 
                        type="number" 
                        {...field} 
                        className={!!form.watch("categorie") ? "bg-muted/50" : ""}
                      />
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
              
            <Button type="submit" className="w-full" disabled={isCreating || !selectedEmployee || isLoadingSalaryData}>
              {isCreating ? "Création en cours..." : "Créer le bulletin de salaire"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
