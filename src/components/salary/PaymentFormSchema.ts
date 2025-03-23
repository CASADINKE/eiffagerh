
import * as z from "zod";

export const paymentFormSchema = z.object({
  payment_period: z.string().min(1, { message: "La période est requise" }),
  payment_date: z.date({
    required_error: "La date de paiement est requise",
  }),
  payment_method: z.string().min(1, { message: "La méthode de paiement est requise" }),
  convention: z.string().optional(),
  description: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const defaultPaymentValues = (currentDate: Date): Partial<PaymentFormValues> => ({
  payment_period: new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate),
  payment_date: currentDate,
  payment_method: "virement",
  convention: "Convention Collective Nationale",
  description: "",
});
