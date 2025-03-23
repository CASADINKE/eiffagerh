
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeaveTableContainer } from "./LeaveTableContainer";
import { Tables } from "@/integrations/supabase/types";

type LeaveRequest = Tables<"leave_requests">;

interface LeaveTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  leaveRequests: LeaveRequest[];
  isLoading: boolean;
}

export function LeaveTabs({ activeTab, onTabChange, leaveRequests, isLoading }: LeaveTabsProps) {
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
      
      <TabsContent value="all" className="pt-4">
        <LeaveTableContainer 
          leaveRequests={leaveRequests} 
          isLoading={isLoading} 
          activeTab="all"
        />
      </TabsContent>
      
      <TabsContent value="pending" className="pt-4">
        <LeaveTableContainer 
          leaveRequests={leaveRequests} 
          isLoading={isLoading} 
          activeTab="pending"
        />
      </TabsContent>
      
      <TabsContent value="approved" className="pt-4">
        <LeaveTableContainer 
          leaveRequests={leaveRequests} 
          isLoading={isLoading} 
          activeTab="approved"
        />
      </TabsContent>
      
      <TabsContent value="rejected" className="pt-4">
        <LeaveTableContainer 
          leaveRequests={leaveRequests} 
          isLoading={isLoading} 
          activeTab="rejected"
        />
      </TabsContent>
    </Tabs>
  );
}
