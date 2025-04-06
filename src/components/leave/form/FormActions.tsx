
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
}

export function FormActions({ onCancel, isLoading }: FormActionsProps) {
  return (
    <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
      </Button>
    </div>
  );
}
