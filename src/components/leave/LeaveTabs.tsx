
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaveTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function LeaveTabs({ activeTab, onTabChange }: LeaveTabsProps) {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList className="flex p-0 h-12 bg-transparent border-b">
        <TabsTrigger 
          value="all" 
          className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          Toutes
        </TabsTrigger>
        <TabsTrigger 
          value="pending" 
          className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          En attente
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          Approuvées
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          Refusées
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
