export type Role = "guest" | "user" | null;
export type Portal = "citizen" | "agency";

const ROLE_KEY = "auth_role";
const PORTAL_KEY = "portal_role";

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
