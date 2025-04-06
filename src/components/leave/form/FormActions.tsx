
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
}

export function FormActions({ onCancel, isLoading }: FormActionsProps) {
  return (
    <div className="flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
      >
        Annuler
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-primary hover:bg-primary/90 transition-all duration-200"
      >
        {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
      </Button>
    </div>
  );
}
