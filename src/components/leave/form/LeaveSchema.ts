
import { z } from "zod";
import { isBefore } from "date-fns";

export const LeaveFormSchema = z.object({
  employee_id: z.string({
    required_error: "Veuillez sélectionner un employé",
  }),
  start_date: z.date({
    required_error: "Veuillez sélectionner une date de début",
  }),
  end_date: z.date({
    required_error: "Veuillez sélectionner une date de fin",
  }),
  type: z.string({
    required_error: "Veuillez sélectionner un type de congé",
  }),
  reason: z.string().optional(),
}).refine(
  (data) => {
    return !isBefore(data.end_date, data.start_date);
  }, 
  {
    message: "La date de fin doit être après la date de début",
    path: ["end_date"],
  }
);

export type LeaveFormValues = z.infer<typeof LeaveFormSchema>;
