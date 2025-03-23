
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tables } from "@/integrations/supabase/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, FileText, Timer } from "lucide-react";

type LeaveRequest = Tables<"leave_requests">;

// Schema for leave request form validation
const leaveRequestSchema = z.object({
  type: z.enum(["annual", "sick", "parental", "other"], {
    required_error: "Veuillez sélectionner un type de congé",
  }),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().min(1, "La date de fin est requise"),
  reason: z.string().optional(),
}).refine(data => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  return end >= start;
}, {
  message: "La date de fin doit être égale ou postérieure à la date de début",
  path: ["end_date"],
});

type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

interface LeaveRequestFormProps {
  onSubmit: (values: LeaveRequestFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function LeaveRequestForm({
  onSubmit,
  onCancel,
  isLoading,
}: LeaveRequestFormProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const form = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      type: "annual",
      start_date: today,
      end_date: today,
      reason: "",
    },
    mode: "onChange", // Validate on change to enable/disable submit button
  });

  const { isValid, errors } = form.formState;
  const selectedType = form.watch("type");

  const getTypeIcon = () => {
    switch (selectedType) {
      case "annual":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "sick":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "parental":
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleSubmit = async (values: LeaveRequestFormData) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-4 flex items-center">
          {getTypeIcon()}
          <span className="ml-2 text-sm font-medium">Vous êtes sur le point de demander un congé. Veuillez remplir tous les champs requis.</span>
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de congé</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un type de congé" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="annual" className="flex items-center">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Congé annuel</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sick">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      <span>Congé maladie</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="parental">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-green-500 mr-2" />
                      <span>Congé parental</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Autre</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={today}
                    placeholder="Date de début"
                    {...field}
                    disabled={isLoading}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={form.getValues("start_date") || today}
                    placeholder="Date de fin"
                    {...field}
                    disabled={isLoading}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motif {selectedType === "sick" ? "(obligatoire)" : "(optionnel)"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Veuillez indiquer le motif de votre demande de congé"
                  {...field}
                  disabled={isLoading}
                  className="min-h-[120px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="transition-all duration-200"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !isValid}
            className="transition-all duration-200 hover:shadow-md"
          >
            {isLoading ? (
              <>
                <div className="mr-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Envoi en cours...
              </>
            ) : (
              "Soumettre la demande"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
