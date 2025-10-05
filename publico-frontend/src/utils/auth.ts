import { User, UserRole, JWTPayload } from '../shared/types/auth';

const TOKEN_KEY = 'publico_auth_token';
const USER_KEY = 'publico_user_data';
const WEB3_ADDRESS = 'web3_address';

// Legacy support for existing code
export type Role = "guest" | "user" | null;
export type Portal = "citizen" | "agency" | "admin";

const ROLE_KEY = "auth_role";
const PORTAL_KEY = "portal_role";

// Legacy functions (keep for backward compatibility)
export const getRole = (): Role =>
  (localStorage.getItem(ROLE_KEY) as Role) || null;
export const setRole = (role: Exclude<Role, null>) =>
  localStorage.setItem(ROLE_KEY, role);
export const clearRole = () => localStorage.removeItem(ROLE_KEY);

export const getPortalRole = (): Portal | null =>
  (localStorage.getItem(PORTAL_KEY) as Portal) || null;
export const setPortalRole = (portal: Portal) =>
  localStorage.setItem(PORTAL_KEY, portal);
export const clearPortalRole = () => localStorage.removeItem(PORTAL_KEY);

export const isAgency = () => getPortalRole() === "agency";
export const isCitizen = () => getPortalRole() === "citizen";
export const isAdmin = () => getPortalRole() === "admin";

// New comprehensive auth system
// Token Management
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(WEB3_ADDRESS)
};

// JWT Token Utilities
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return false;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

// User Session Management
export const setUserData = (userData: Partial<User>): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserData = (): Partial<User> | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const getCurrentUserRole = (): UserRole | null => {
  const token = getAuthToken();
  if (!token || !isTokenValid(token)) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.role || null;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token ? isTokenValid(token) : false;
};

export const hasRole = (requiredRoles: UserRole[]): boolean => {
  const userRole = getCurrentUserRole();
  return userRole ? requiredRoles.includes(userRole) : false;
};

// Logout
export const logout = (): void => {
  removeAuthToken();
  clearRole();
  clearPortalRole();
  window.location.href = '/login';
};

// Validation Utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_.])[A-Za-z\d@$!%*?&\-_.]{8,}$/;
  return passwordRegex.test(password);
};

export const getPasswordValidationMessage = (): string => {
  return "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
};
