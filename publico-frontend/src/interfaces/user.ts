export interface AgencyWeb3Account {
  address: string;
  privateKey: string;
  decrypted_test_key: string;
}

export interface UseData {
  _id: string;
  email: string;
  role: string;
  isVerified: boolean; // Email verification status
  isAgencyVerified?: boolean; // Agency application approval status
  token: string | null;
  resetCode: string | null;
  resetCodeExpiration: string | null;
  agency_id?: string;
  agency_name?: string;
  agency_code?: string;
  department?: string;
  contact_phone: string;
  address: string;
  isConnected: boolean;
  date_registered: string;
  isPending?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Admin-specific fields
  first_name?: string;
  last_name?: string;
  admin_id?: string;
}

export interface Milestone  {
  id: string
  title: string
  targetDate: string
  budget: string
  budgetPercentage?: number // Percentage of total budget (0-100)
  deliverables: string
}
