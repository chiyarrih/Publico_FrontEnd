import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ---------- Always-on pages (keep static) ---------- */
import LoginPage from "./features/citizen/PAGES/LoginPage";
import SignupPage from "./features/citizen/PAGES/SignupPage";

/* ---------- Layouts & guard ---------- */
import GuestRoute from "./routes/GuestRoute";
import AppLayout from "./features/citizen/components/Layout";
import AgencyLayout from "./features/agency/layout/AgencyLayout";
import AdminLayout from "./features/admin/layout/AdminLayout";

/* ---------- Shared debug wrappers ---------- */
import Loading from "./shared/components/layout/Loading";
import ErrorBoundary from "./shared/components/layout/ErrorBoundary";

/* ---------- Lazy citizen pages ---------- */
const CitizenDashboard = lazy(() => import("./features/citizen/PAGES/Dashboard"));
const Alerts         = lazy(() => import("./features/citizen/PAGES/Alerts"));
const FAQ            = lazy(() => import("./features/citizen/PAGES/FAQ"));
const Ledger         = lazy(() => import("./features/citizen/PAGES/Ledger"));
const Profile        = lazy(() => import("./features/citizen/PAGES/Profile"));
const Transparency   = lazy(() => import("./features/citizen/PAGES/Transparency"));
const Support        = lazy(() => import("./features/citizen/PAGES/Support"));

/* ---------- Lazy agency pages ---------- */
const AgencyDashboard = lazy(() => import("./features/agency/pages/AgencyDashboard"));
const Budgets         = lazy(() => import("./features/agency/pages/Budgets"));
const Documents       = lazy(() => import("./features/agency/pages/Documents"));
const Transactions    = lazy(() => import("./features/agency/pages/Transactions"));
const SmartAlerts     = lazy(() => import("./features/agency/pages/SmartAlerts"));
const FAQs            = lazy(() => import("./features/agency/pages/FAQs"));
const ContactSupport  = lazy(() => import("./features/agency/pages/ContactSupport"));
const AgencyProfile   = lazy(() => import("./features/agency/pages/Profile"));

/* ---------- Lazy admin pages (NEW) ---------- */
const AdminDashboard     = lazy(() => import("./features/admin/pages/Dashboard"));
const AdminRequests      = lazy(() => import("./features/admin/pages/BudgetRequests"));
const AdminAnalytics     = lazy(() => import("./features/admin/pages/Analytics"));
const AdminTransactions  = lazy(() => import("./features/admin/pages/Transactions"));
const AdminSmartAlerts   = lazy(() => import("./features/admin/pages/SmartAlerts"));
const AdminProfile       = lazy(() => import("./features/admin/pages/Profile"));

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
          {/* auth */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* citizen app */}
          <Route
            path="/app"
            element={
              <GuestRoute>
                <AppLayout />
              </GuestRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<Safe><CitizenDashboard /></Safe>} />
            <Route path="alerts"       element={<Safe><Alerts /></Safe>} />
            <Route path="faq"          element={<Safe><FAQ /></Safe>} />
            <Route path="ledger"       element={<Safe><Ledger /></Safe>} />
            <Route path="profile"      element={<Safe><Profile /></Safe>} />
            <Route path="transparency" element={<Safe><Transparency /></Safe>} />
            <Route path="support"      element={<Safe><Support /></Safe>} />
          </Route>

          {/* agency portal */}
          <Route
            path="/agency"
            element={
              <GuestRoute>
                <AgencyLayout />
              </GuestRoute>
            }
          >
            <Route index               element={<Safe><AgencyDashboard /></Safe>} />
            <Route path="budgets"      element={<Safe><Budgets /></Safe>} />
            <Route path="documents"    element={<Safe><Documents /></Safe>} />
            <Route path="transactions" element={<Safe><Transactions /></Safe>} />
            <Route path="alerts"       element={<Safe><SmartAlerts /></Safe>} />
            <Route path="faqs"         element={<Safe><FAQs /></Safe>} />
            <Route path="support"      element={<Safe><ContactSupport /></Safe>} />
            <Route path="profile"      element={<Safe><AgencyProfile /></Safe>} />
          </Route>

          {/* admin portal (NEW) */}
          <Route
            path="/admin"
            element={
              <GuestRoute>
                <AdminLayout />
              </GuestRoute>
            }
          >
            <Route index               element={<Safe><AdminDashboard /></Safe>} />
            <Route path="requests"     element={<Safe><AdminRequests /></Safe>} />
            <Route path="analytics"    element={<Safe><AdminAnalytics /></Safe>} />
            <Route path="transactions" element={<Safe><AdminTransactions /></Safe>} />
            <Route path="alerts"       element={<Safe><AdminSmartAlerts /></Safe>} />
            <Route path="profile"      element={<Safe><AdminProfile /></Safe>} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
