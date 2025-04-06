
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addBusinessDays } from "date-fns";
import { Form } from "@/components/ui/form";
import { Employee } from "@/hooks/useEmployees";
import { mapEmployeesToUI } from "@/types/employee";
import { CalendarField } from "./form/CalendarField";
import { EmployeeSelect } from "./form/EmployeeSelect";
import { LeaveTypeSelect } from "./form/LeaveTypeSelect";
import { ReasonTextarea } from "./form/ReasonTextarea";
import { FormActions } from "./form/FormActions";
import { LeaveFormSchema, LeaveFormValues } from "./form/LeaveSchema";

interface LeaveRequestFormProps {
  employees: Employee[];
  onSubmit: (values: LeaveFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function LeaveRequestForm({
  employees,
  onSubmit,
  onCancel,
  isLoading,
}: LeaveRequestFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(LeaveFormSchema),
    defaultValues: {
      employee_id: "",
      start_date: date,
      end_date: addBusinessDays(date || new Date(), 5),
      type: "",
      reason: "",
    },
    mode: "onChange", // Enable validation on change
  });

  const mappedEmployees = mapEmployeesToUI(employees);
  
  // Set default employee if available and not already set
  useEffect(() => {
    if (employees.length > 0 && !form.getValues("employee_id")) {
      form.setValue("employee_id", employees[0].id);
    }
  }, [employees, form]);
  
  const disableDates = (date: Date) => {
    return date < new Date() || date > addBusinessDays(new Date(), 90);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EmployeeSelect control={form.control} employees={mappedEmployees} />
        
        <div className="flex flex-col md:flex-row gap-4">
          <CalendarField 
            control={form.control}
            name="start_date"
            label="Date de début"
            disabled={disableDates}
          />
          
          <CalendarField 
            control={form.control}
            name="end_date"
            label="Date de fin"
            disabled={disableDates}
          />
        </div>
        
        <LeaveTypeSelect control={form.control} />
        <ReasonTextarea control={form.control} />
        
        <FormActions onCancel={onCancel} isLoading={isLoading} />
      </form>
    </Form>
  );
}
