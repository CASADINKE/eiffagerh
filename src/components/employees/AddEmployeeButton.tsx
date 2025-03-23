
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddEmployeeButtonProps {
  onClick: () => void;
}

const AddEmployeeButton = ({ onClick }: AddEmployeeButtonProps) => {
  return (
    <Button 
      variant="default" 
      className="gap-2 px-5 py-2" 
      onClick={onClick}
    >
      <Plus size={16} />
      Nouvel employé
    </Button>
  );
};

export default AddEmployeeButton;
