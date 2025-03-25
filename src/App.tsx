
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Leave from "@/pages/Leave";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import TimeTracking from "@/pages/TimeTracking";
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
