
import { useParams } from "react-router-dom";
import EmployeePayslipsComponent from "@/components/salary/EmployeePayslips";

export default function EmployeePayslipsPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  
  if (!employeeId) {
    return <div className="container mx-auto p-6">Identifiant d'employé manquant</div>;
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Bulletins de Paie - Employé</h1>
      <EmployeePayslipsComponent employeeId={employeeId} />
    </div>
  );
}
