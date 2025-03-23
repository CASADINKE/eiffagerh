
import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AnimatedTransition from "../ui/AnimatedTransition";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 px-6 py-8 overflow-auto">
            <AnimatedTransition>
              {children}
            </AnimatedTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
