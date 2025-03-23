
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
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createSalaryPayment } from "@/services/salaryPaymentService";
import { PaymentFormFields } from "./PaymentFormFields";
import { paymentFormSchema, PaymentFormValues, defaultPaymentValues } from "./PaymentFormSchema";

interface SalaryPaymentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function SalaryPaymentDialog({ open, onOpenChange, className }: SalaryPaymentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use either controlled or uncontrolled state
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: defaultPaymentValues(new Date()),
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
        form.reset(defaultPaymentValues(new Date()));
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
          <Button className={`gap-2 ${className || ''}`} onClick={() => setIsOpen(true)}>
            <CreditCard className="h-4 w-4" />
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
            <PaymentFormFields form={form} />
            
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
