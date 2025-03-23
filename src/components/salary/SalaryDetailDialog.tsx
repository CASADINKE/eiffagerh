
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateSalaryDetail, useUpdateSalaryDetail } from "@/hooks/useSalaryDetails";
import { SalaryDetail } from "@/services/salaryDetailsService";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/hooks/useEmployees";

interface SalaryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salaryDetail?: SalaryDetail | null;
  employeeId?: string;
  onSuccess?: () => void;
}

export function SalaryDetailDialog({ 
  open, 
  onOpenChange, 
  salaryDetail, 
  employeeId,
  onSuccess 
}: SalaryDetailDialogProps) {
  const { toast } = useToast();
  const createSalaryDetail = useCreateSalaryDetail();
  const updateSalaryDetail = useUpdateSalaryDetail();
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees();
  
  const [formData, setFormData] = React.useState({
    employee_id: '',
    base_salary: 0,
    contract_type: 'CDI',
    pay_grade: '',
    currency: 'FCFA',
    payment_frequency: 'monthly',
    tax_rate: 15,
  });

  React.useEffect(() => {
    if (salaryDetail) {
      setFormData({
        employee_id: salaryDetail.employee_id,
        base_salary: salaryDetail.base_salary,
        contract_type: salaryDetail.contract_type,
        pay_grade: salaryDetail.pay_grade || '',
        currency: salaryDetail.currency,
        payment_frequency: salaryDetail.payment_frequency,
        tax_rate: salaryDetail.tax_rate || 15,
      });
    } else if (employeeId) {
      setFormData(prev => ({ ...prev, employee_id: employeeId }));
    }
  }, [salaryDetail, employeeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert specific fields to numbers
    const numericData = {
      ...formData,
      base_salary: Number(formData.base_salary),
      tax_rate: Number(formData.tax_rate),
    };

    try {
      if (salaryDetail) {
        // Update existing salary detail
        await updateSalaryDetail.mutateAsync({
          id: salaryDetail.id,
          data: numericData,
        });
        toast({
          title: "Succès",
          description: "Détails du salaire mis à jour avec succès",
        });
      } else {
        // Create new salary detail
        // Make sure to include all required fields and ensure none are undefined
        const newSalaryDetail = {
          employee_id: numericData.employee_id,
          base_salary: numericData.base_salary,
          contract_type: numericData.contract_type,
          pay_grade: numericData.pay_grade,
          currency: numericData.currency,
          payment_frequency: numericData.payment_frequency,
          tax_rate: numericData.tax_rate,
        };
        
        await createSalaryDetail.mutateAsync(newSalaryDetail);
        toast({
          title: "Succès",
          description: "Détails du salaire créés avec succès",
        });
      }
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving salary detail:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement des détails du salaire",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{salaryDetail ? "Modifier" : "Ajouter"} les détails du salaire</DialogTitle>
          <DialogDescription>
            {salaryDetail 
              ? "Modifier les informations salariales de l'employé"
              : "Ajouter les informations salariales pour un nouvel employé"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {!salaryDetail && !employeeId && (
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employé</Label>
                <Select 
                  value={formData.employee_id} 
                  onValueChange={(value) => handleSelectChange("employee_id", value)}
                  disabled={isLoadingEmployees}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.prenom} {employee.nom} - {employee.matricule}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_salary">Salaire de base</Label>
                <Input
                  id="base_salary"
                  name="base_salary"
                  type="number"
                  value={formData.base_salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => handleSelectChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FCFA">FCFA</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract_type">Type de contrat</Label>
                <Select 
                  value={formData.contract_type} 
                  onValueChange={(value) => handleSelectChange("contract_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Intérim">Intérim</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pay_grade">Grade</Label>
                <Input
                  id="pay_grade"
                  name="pay_grade"
                  value={formData.pay_grade}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment_frequency">Fréquence de paiement</Label>
                <Select 
                  value={formData.payment_frequency} 
                  onValueChange={(value) => handleSelectChange("payment_frequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="biweekly">Bimensuel</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Taux d'imposition (%)</Label>
                <Input
                  id="tax_rate"
                  name="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.tax_rate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={createSalaryDetail.isPending || updateSalaryDetail.isPending}
            >
              {createSalaryDetail.isPending || updateSalaryDetail.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
