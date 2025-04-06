
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface LeaveTypeSelectProps {
  control: Control<any>;
}

export function LeaveTypeSelect({ control }: LeaveTypeSelectProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de congé</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="paid">Congé payé</SelectItem>
              <SelectItem value="unpaid">Congé non payé</SelectItem>
              <SelectItem value="sick">Congé maladie</SelectItem>
              <SelectItem value="maternity">Congé maternité</SelectItem>
              <SelectItem value="paternity">Congé paternité</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
