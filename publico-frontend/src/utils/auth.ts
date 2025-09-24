export type Role = "guest" | "user" | null;
const KEY = "auth_role";

export const getRole = (): Role => (localStorage.getItem(KEY) as Role) || null;
export const setRole = (role: Exclude<Role, null>) => localStorage.setItem(KEY, role);
export const clearRole = () => localStorage.removeItem(KEY);
