
import React from "react";

const EmployeePageHeader = () => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-medium text-gray-700">Lister les employés</h1>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-gray-500">Accueil</span>
        <span className="text-gray-500">&gt;</span>
        <span className="text-gray-700">Employés</span>
      </div>
    </div>
  );
};

export default EmployeePageHeader;
