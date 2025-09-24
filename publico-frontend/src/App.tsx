import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./PAGES/LoginPage";
import SignupPage from "./PAGES/SignupPage";
import Alerts from "./PAGES/Alerts";
import FAQ from "./PAGES/FAQ";
import Ledger from "./PAGES/Ledger";
import Profile from "./PAGES/Profile";
import Transparency from "./PAGES/Transparency";
import Support from "./PAGES/Support";

import GuestRoute from "./routes/GuestRoute";
import AppLayout from "./components/Layout";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";

// IMPORTANT: your current rich dashboard (with Recharts)
const RichDashboard = lazy(() => import("./PAGES/Dashboard"));

// Tiny safe fallback dashboard (always works)
const SafeDashboard: React.FC = () => (
  <div className="card p-6">
    <h1 className="text-lg font-semibold">Dashboard</h1>
    <p className="text-slate-600 text-sm mt-2">
      If charts fail to load, you’ll see this instead. Check console for errors.
    </p>
  </div>
);

const DashboardWrapper: React.FC = () => (
  <ErrorBoundary>
    <Suspense fallback={<Loading label="Loading dashboard..." />}>
      <RichDashboard />
    </Suspense>
  </ErrorBoundary>
);

const App: React.FC = () => {
  return (
    <Routes>
      {/* auth */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* protected app */}
      <Route
        path="/app"
        element={
          <GuestRoute>
            <AppLayout />
          </GuestRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* If the rich dashboard throws, ErrorBoundary will render a message; as an extra guard,
            duplicate route to a safe one you can switch to quickly by replacing element below */}
        <Route path="dashboard" element={<DashboardWrapper />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="ledger" element={<Ledger />} />
        <Route path="profile" element={<Profile />} />
        <Route path="transparency" element={<Transparency />} />
        <Route path="support" element={<Support />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
