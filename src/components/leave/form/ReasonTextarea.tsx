
import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface ReasonTextareaProps {
  control: Control<any>;
}

export function ReasonTextarea({ control }: ReasonTextareaProps) {
  return (
    <FormField
      control={control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Raison (optionnel)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Décrivez la raison de votre demande de congé"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Fournissez une raison pour votre demande de congé.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
