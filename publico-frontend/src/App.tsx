import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { clearOldAgencyApprovalKeys } from "./utils/auth";

/* ---------- Auth pages ---------- */
import { LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage } from "./features/auth";
import OTPVerificationPage from "./features/auth/components/OTPVerificationPage";
import ApplicationUnderReviewPage from "./features/auth/components/ApplicationUnderReviewPage";
import ApplicationRejectedPage from "./features/auth/components/ApplicationRejectedPage";
import ApplicationApprovedPage from "./features/auth/components/ApplicationApprovedPage";

/* ---------- Layouts & guard ---------- */
import GuestRoute from "./routes/GuestRoute";
import { AdminRoute, AgencyRoute, CitizenRoute } from './routes/ProtectedRoute';
import AppLayout from "./features/citizen/view/components/Layout";
import AgencyLayout from "./features/agency/view/layout/AgencyLayout";
import AdminLayout from "./features/admin/view/layout/AdminLayout";

/* ---------- Shared wrappers ---------- */
import Loading from "./shared/components/layout/Loading";
import ErrorBoundary from "./shared/components/layout/ErrorBoundary";

/* ---------- Lazy citizen pages ---------- */
const CitizenDashboard = lazy(() => import("./features/citizen/view/PAGES/Dashboard"));

const Ledger         = lazy(() => import("./features/citizen/view/PAGES/Ledger"));
const Transparency   = lazy(() => import("./features/citizen/view/PAGES/Transparency"));
const Support        = lazy(() => import("./features/citizen/view/PAGES/Support"));

/* ---------- Lazy agency pages ---------- */
const AgencyDashboard = lazy(() => import("./features/agency/view/pages/AgencyDashboard"));
const Budgets         = lazy(() => import("./features/agency/view/pages/Budgets"));
const Documents       = lazy(() => import("./features/agency/view/pages/Documents"));
const Transactions    = lazy(() => import("./features/agency/view/pages/Transactions"));
const SmartAlerts     = lazy(() => import("./features/agency/view/pages/SmartAlerts"));
const FAQs            = lazy(() => import("./features/agency/view/pages/FAQs"));
const ContactSupport  = lazy(() => import("./features/agency/view/pages/ContactSupport"));
const AgencyProfile   = lazy(() => import("./features/agency/view/pages/Profile"));

/* ---------- NEW: Milestones pages ---------- */
const Milestones      = lazy(() => import("./features/agency/view/pages/Milestones"));
const MilestoneDetail = lazy(() => import("./features/agency/view/pages/MilestoneDetail"));

/* ---------- Lazy admin pages ---------- */
const AdminDashboard     = lazy(() => import("./features/admin/view/pages/Dashboard"));
const AdminRequests      = lazy(() => import("./features/admin/view/pages/BudgetRequests"));
const AdminAnalytics     = lazy(() => import("./features/admin/view/pages/Analytics"));
const AdminTransactions  = lazy(() => import("./features/admin/view/pages/Transactions"));
const AdminSmartAlerts   = lazy(() => import("./features/admin/view/pages/SmartAlerts"));
const AdminProfile       = lazy(() => import("./features/admin/view/pages/Profile"));
const SendBudgetToAgency = lazy(() => import("./features/admin/view/pages/SendBudgetToAgency"));
const AdminProjectMilestones = lazy(() => import("./features/admin/view/pages/ProjectMilestones"));
const AdminProjectDetails = lazy(() => import("./features/admin/view/pages/ProjectDetails"));
const AdminMilestoneDetail = lazy(() => import("./features/admin/view/pages/MilestoneDetail"));
const AgencyVerification = lazy(() => import("./features/admin/view/pages/AgencyVerification"));
const AdminContactSupport = lazy(() => import("./features/admin/view/components/ContactSupportView"));
const CitizenMilestones      = lazy(() => import("./features/citizen/view/PAGES/Milestones"));
const CitizenMilestoneDetail = lazy(() => import("./features/citizen/view/PAGES/MilestoneDetail"));


function Safe({ children }: React.PropsWithChildren) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  // Clear old agency approval keys on app start (migration)
  useEffect(() => {
    clearOldAgencyApprovalKeys();
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading label="Loading app..." />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/citizen" replace />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/verify-otp" element={<GuestRoute><OTPVerificationPage /></GuestRoute>} />
          <Route path="/application-under-review" element={<GuestRoute><ApplicationUnderReviewPage /></GuestRoute>} />
          <Route path="/application-rejected" element={<GuestRoute><ApplicationRejectedPage /></GuestRoute>} />
          <Route path="/application-approved" element={<GuestRoute><ApplicationApprovedPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

          {/* Citizen */}
          <Route path="/citizen" element={<CitizenRoute><AppLayout /></CitizenRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Safe><CitizenDashboard /></Safe>} />
            <Route path="ledger" element={<Safe><Ledger /></Safe>} />
            <Route path="transparency" element={<Safe><Transparency /></Safe>} />
            <Route path="support" element={<Safe><Support /></Safe>} />
            <Route path="milestones" element={<Safe><CitizenMilestones /></Safe>} />
            <Route path="milestones/:id" element={<Safe><CitizenMilestoneDetail /></Safe>} />
          </Route>

          {/* Legacy redirect */}
          <Route path="/app/*" element={<Navigate to="/citizen" replace />} />

          {/* Agency */}
          <Route path="/agency" element={<AgencyRoute><AgencyLayout /></AgencyRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Safe><AgencyDashboard /></Safe>} />
            {/* NEW routes */}
            <Route path="milestones" element={<Safe><Milestones /></Safe>} />
            <Route path="milestones/:id" element={<Safe><MilestoneDetail /></Safe>} />
            {/* existing */}
            <Route path="budgets" element={<Safe><Budgets /></Safe>} />
            <Route path="documents" element={<Safe><Documents /></Safe>} />
            <Route path="transactions" element={<Safe><Transactions /></Safe>} />
            <Route path="alerts" element={<Safe><SmartAlerts /></Safe>} />
            <Route path="faqs" element={<Safe><FAQs /></Safe>} />
            <Route path="support" element={<Safe><ContactSupport /></Safe>} />
            <Route path="profile" element={<Safe><AgencyProfile /></Safe>} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Safe><AdminDashboard /></Safe>} />
            <Route path="requests" element={<Safe><AdminRequests /></Safe>} />
            <Route path="send-budget" element={<Safe><SendBudgetToAgency /></Safe>} />
            <Route path="analytics" element={<Safe><AdminAnalytics /></Safe>} />
            <Route path="transactions" element={<Safe><AdminTransactions /></Safe>} />
            <Route path="alerts" element={<Safe><AdminSmartAlerts /></Safe>} />
            <Route path="profile" element={<Safe><AdminProfile /></Safe>} />
            <Route path="milestones" element={<Safe><AdminProjectMilestones /></Safe>} />
            <Route path="milestones/:id" element={<Safe><AdminMilestoneDetail /></Safe>} />
            <Route path="verification" element={<Safe><AgencyVerification /></Safe>} />
            <Route path="contact-support" element={<Safe><AdminContactSupport /></Safe>} />
          </Route>

          {/* Errors */}
          <Route path="/unauthorized" element={<div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
            <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
          </div>} />
          <Route path="/404" element={<div className="p-8 text-center">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
          </div>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
