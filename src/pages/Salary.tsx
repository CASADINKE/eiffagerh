
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { exportToCSV } from "@/utils/exportUtils";
import { SalaryHeader } from "@/components/salary/SalaryHeader";
import { SalaryStatCards } from "@/components/salary/SalaryStatCards";
import { PayslipsTable } from "@/components/salary/PayslipsTable";
import { SalariesTable } from "@/components/salary/SalariesTable";
import { SalaryAnalytics } from "@/components/salary/SalaryAnalytics";
import { 
  salaryData, 
  departmentSalaryData, 
  paySlipData 
} from "@/data/salaryData";

const Salary = () => {
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("payslips");
  
  const filteredData = salaryData.filter(
    item => departmentFilter === "all" || item.department === departmentFilter
  );
  
  const departments = [...new Set(salaryData.map(item => item.department))];
  
  // Calculer les dépenses salariales totales
  const totalSalaryExpense = salaryData.reduce((sum, item) => sum + item.totalSalary, 0);
  const averageSalary = totalSalaryExpense / salaryData.length;

  // Fonction pour exporter les bulletins de paie
  const exportPayslips = () => {
    const headers = {
      id: "ID",
      employee: "Employé",
      position: "Poste",
      period: "Période",
      baseSalary: "Salaire de base",
      allowances: "Indemnités",
      deductions: "Déductions",
      netSalary: "Salaire net",
      status: "Statut",
      date: "Date d'émission"
    };
    
    exportToCSV(paySlipData, "bulletins-de-paie", headers);
  };
  
  return (
    <div className="container mx-auto">
      <SalaryHeader exportPayslips={exportPayslips} />
      
      <SalaryStatCards 
        totalSalaryExpense={totalSalaryExpense} 
        averageSalary={averageSalary} 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="payslips">Bulletins de paie</TabsTrigger>
          <TabsTrigger value="salaries">Salaires</TabsTrigger>
          <TabsTrigger value="analytics">Analyse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payslips">
          <PayslipsTable paySlipData={paySlipData} />
        </TabsContent>
        
        <TabsContent value="salaries">
          <SalariesTable 
            filteredData={filteredData} 
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            departments={departments}
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <SalaryAnalytics departmentSalaryData={departmentSalaryData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Salary;
