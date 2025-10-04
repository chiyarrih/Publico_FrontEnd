import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ---------- Auth pages (shared across all user types) ---------- */
import { LoginPage, SignupPage } from "./features/view/auth";

/* ---------- Layouts & guard ---------- */
import GuestRoute from "./routes/GuestRoute";
import { 
  AdminRoute, 
  AgencyRoute, 
  CitizenRoute
} from './routes/ProtectedRoute';
import AppLayout from "./features/view/citizen/components/Layout";
import AgencyLayout from "./features/view/agency/view/layout/AgencyLayout";
import AdminLayout from "./features/view/admin/layout/AdminLayout";

/* ---------- Shared debug wrappers ---------- */
import Loading from "./shared/components/layout/Loading";
import ErrorBoundary from "./shared/components/layout/ErrorBoundary";

/* ---------- Lazy citizen pages ---------- */
const CitizenDashboard = lazy(() => import("./features/view/citizen/PAGES/Dashboard"));
const Alerts         = lazy(() => import("./features/view/citizen/PAGES/Alerts"));
const FAQ            = lazy(() => import("./features/view/citizen/PAGES/FAQ"));
const Ledger         = lazy(() => import("./features/view/citizen/PAGES/Ledger"));
const Profile        = lazy(() => import("./features/view/citizen/PAGES/Profile"));
const Transparency   = lazy(() => import("./features/view/citizen/PAGES/Transparency"));
const Support        = lazy(() => import("./features/view/citizen/PAGES/Support"));

/* ---------- Lazy agency pages ---------- */
const AgencyDashboard = lazy(() => import("./features/view/agency/pages/AgencyDashboard"));
const Budgets         = lazy(() => import("./features/view/agency/pages/Budgets"));
const Documents       = lazy(() => import("./features/view/agency/pages/Documents"));
const Transactions    = lazy(() => import("./features/view/agency/pages/Transactions"));
const SmartAlerts     = lazy(() => import("./features/view/agency/pages/SmartAlerts"));
const FAQs            = lazy(() => import("./features/view/agency/pages/FAQs"));
const ContactSupport  = lazy(() => import("./features/view/agency/pages/ContactSupport"));
const AgencyProfile   = lazy(() => import("./features/view/agency/pages/Profile"));

/* ---------- Lazy admin pages (NEW) ---------- */
const AdminDashboard     = lazy(() => import("./features/view/admin/pages/Dashboard"));
const AdminRequests      = lazy(() => import("./features/view/admin/pages/BudgetRequests"));
const AdminAnalytics     = lazy(() => import("./features/view/admin/pages/Analytics"));
const AdminTransactions  = lazy(() => import("./features/view/admin/pages/Transactions"));
const AdminSmartAlerts   = lazy(() => import("./features/view/admin/pages/SmartAlerts"));
const AdminProfile       = lazy(() => import("./features/view/admin/pages/Profile"));

/* Helper to show component-level crashes instead of white screen */
function Safe({ children }: React.PropsWithChildren) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading label="Loading app..." />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route 
            path="/login" 
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            } 
          />

          {/* Citizen Routes */}
          <Route 
            path="/citizen" 
            element={
              <CitizenRoute>
                <AppLayout />
              </CitizenRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Safe><CitizenDashboard /></Safe>} />
            <Route path="alerts" element={<Safe><Alerts /></Safe>} />
            <Route path="faq" element={<Safe><FAQ /></Safe>} />
            <Route path="ledger" element={<Safe><Ledger /></Safe>} />
            <Route path="profile" element={<Safe><Profile /></Safe>} />
            <Route path="transparency" element={<Safe><Transparency /></Safe>} />
            <Route path="support" element={<Safe><Support /></Safe>} />
          </Route>

          {/* Legacy /app route redirect */}
          <Route path="/app/*" element={<Navigate to="/citizen" replace />} />

          {/* Agency Routes */}
          <Route 
            path="/agency" 
            element={
              <AgencyRoute>
                <AgencyLayout />
              </AgencyRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Safe><AgencyDashboard /></Safe>} />
            <Route path="budgets" element={<Safe><Budgets /></Safe>} />
            <Route path="documents" element={<Safe><Documents /></Safe>} />
            <Route path="transactions" element={<Safe><Transactions /></Safe>} />
            <Route path="alerts" element={<Safe><SmartAlerts /></Safe>} />
            <Route path="faqs" element={<Safe><FAQs /></Safe>} />
            <Route path="support" element={<Safe><ContactSupport /></Safe>} />
            <Route path="profile" element={<Safe><AgencyProfile /></Safe>} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Safe><AdminDashboard /></Safe>} />
            <Route path="requests" element={<Safe><AdminRequests /></Safe>} />
            <Route path="analytics" element={<Safe><AdminAnalytics /></Safe>} />
            <Route path="transactions" element={<Safe><AdminTransactions /></Safe>} />
            <Route path="alerts" element={<Safe><AdminSmartAlerts /></Safe>} />
            <Route path="profile" element={<Safe><AdminProfile /></Safe>} />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
            <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
          </div>} />
          <Route path="/404" element={<div className="p-8 text-center">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
          </div>} />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
