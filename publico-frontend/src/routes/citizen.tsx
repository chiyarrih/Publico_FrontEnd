import LoginPage from "../citizen/PAGES/LoginPage";
import Dashboard from "../citizen/PAGES/Dashboard";

const citizenRoutes = [
  { path: "/citizen/login", element: <LoginPage /> },
  { path: "/citizen/dashboard", element: <Dashboard /> },
];

export default citizenRoutes;
