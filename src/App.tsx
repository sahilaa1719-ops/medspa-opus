import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { PayrollLayout } from "@/components/layout/PayrollLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PayrollDashboard from "./pages/PayrollDashboard";
import RunPayroll from "./pages/RunPayroll";
import PayrollEmployees from "./pages/PayrollEmployees";
import PayrollPayStubs from "./pages/PayrollPayStubs";
import PayrollTimeEntry from "./pages/PayrollTimeEntry";
import PayrollTaxes from "./pages/PayrollTaxes";
import PayrollReports from "./pages/PayrollReports";
import PayrollSettings from "./pages/PayrollSettings";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeDocuments from "./pages/EmployeeDocuments";
import EmployeeLicenses from "./pages/EmployeeLicenses";
import EmployeeAnnouncements from "./pages/EmployeeAnnouncements";
import EmployeePayroll from "./pages/EmployeePayroll";
import EmployeeTaxes from "./pages/EmployeeTaxes";
import EmployeeSettings from "./pages/EmployeeSettings";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import Locations from "./pages/Locations";
import Documents from "./pages/Documents";
import Licenses from "./pages/Licenses";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  // Determine redirect path based on user role
  const getRedirectPath = () => {
    if (!user) return "/login";
    if (user.role === 'admin') return '/dashboard';
    if (user.role === 'payroll') return '/payroll-dashboard';
    return '/employee-dashboard';
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={getRedirectPath()} replace /> : <Login />}
      />
      
      {/* Admin Portal Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={getRedirectPath()} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="locations" element={<Locations />} />
        <Route path="documents" element={<Documents />} />
        <Route path="licenses" element={<Licenses />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Payroll Portal Routes */}
      <Route
        path="/payroll-dashboard"
        element={
          <ProtectedRoute>
            <PayrollLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PayrollDashboard />} />
      </Route>

      <Route
        path="/payroll-run"
        element={
          <ProtectedRoute>
            <PayrollLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RunPayroll />} />
      </Route>

      <Route
        path="/payroll-employees"
        element={
          <ProtectedRoute>
            <PayrollLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PayrollEmployees />} />
      </Route>

      <Route
        path="/payroll-paystubs"
        element={
          <ProtectedRoute>
            <PayrollLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PayrollPayStubs />} />
      </Route>

      <Route
        path="/payroll-timeentry"
        element={
          <ProtectedRoute>
            <PayrollLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PayrollTimeEntry />} />
      </Route>

      <Route
        path="/payroll-taxes"
        element={
          <ProtectedRoute>
            <PayrollLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PayrollTaxes />} />
      </Route>

      <Route
        path="/payroll-reports"
        element={
          <ProtectedRoute>
            <PayrollLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PayrollReports />} />
      </Route>

      <Route
        path="/payroll-settings"
        element={
          <ProtectedRoute>
            <PayrollLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PayrollSettings />} />
      </Route>

      {/* Employee Portal Routes */}
      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
      </Route>

      <Route
        path="/employee-profile"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeProfile />} />
      </Route>

      <Route
        path="/employee-documents"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDocuments />} />
      </Route>

      <Route
        path="/employee-licenses"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeLicenses />} />
      </Route>

      <Route
        path="/employee-announcements"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeAnnouncements />} />
      </Route>

      <Route
        path="/employee-payroll"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeePayroll />} />
      </Route>

      <Route
        path="/employee-taxes"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeTaxes />} />
      </Route>

      <Route
        path="/employee-settings"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
