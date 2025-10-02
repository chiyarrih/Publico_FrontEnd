import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ---------- Always-on pages (keep static) ---------- */
import LoginPage from "./features/view/citizen/PAGES/LoginPage";
import SignupPage from "./features/view/citizen/PAGES/SignupPage";

/* ---------- Layouts & guard ---------- */
import GuestRoute from "./routes/GuestRoute";
import { 
  ProtectedRoute, 
  AdminRoute, 
  AgencyRoute, 
  CitizenRoute
} from './routes/ProtectedRoute';
import AppLayout from "./features/view/citizen/components/Layout";
import AgencyLayout from "./features/view/agency/layout/AgencyLayout";
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
const AdminMilestones    = lazy(() => import("./features/view/admin/pages/Milestones"));
const AdminSmartAlerts   = lazy(() => import("./features/view/admin/pages/SmartAlerts"));
const AdminVerification  = lazy(() => import("./features/view/admin/pages/Verification"));
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
            <Route path="milestones" element={<Safe><AdminMilestones /></Safe>} />
            <Route path="alerts" element={<Safe><AdminSmartAlerts /></Safe>} />
            <Route path="verification" element={<Safe><AdminVerification /></Safe>} />
            <Route path="profile" element={<Safe><AdminProfile /></Safe>} />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-6">You don't have permission to access this page. Please log in with the correct account type.</p>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    // Clear any existing auth data and redirect to login
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Back to Login
                </button>
                <button 
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
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
