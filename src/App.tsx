
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Leave from "@/pages/Leave";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import TimeTracking from "@/pages/TimeTracking";
import Pointage from "@/pages/Pointage";
import PointageAdmin from "@/pages/PointageAdmin";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "sonner";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import EmployeePayslipsPage from "@/pages/EmployeePayslips";
import GestionSalaires from "@/pages/GestionSalaires";
import EmployeeSalaires from "@/pages/EmployeeSalaires";
import GestionRemunerations from "@/pages/GestionRemunerations";

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Employees />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/time-tracking"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TimeTracking />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pointage"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Pointage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pointage-admin"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PointageAdmin />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leave"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Leave />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee-payslips/:employeeId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EmployeePayslipsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee-salaires/:matricule"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EmployeeSalaires />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gestion-salaires"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <GestionSalaires />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gestion-remunerations"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <GestionRemunerations />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
