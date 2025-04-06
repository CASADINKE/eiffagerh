
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { EmployeeUI } from "@/types/employee";

interface EmployeeSelectProps {
  control: Control<any>;
  employees: EmployeeUI[];
}

export function EmployeeSelect({ control, employees }: EmployeeSelectProps) {
  return (
    <FormField
      control={control}
      name="employee_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Employé</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
