// User Roles
export type UserRole = 'Citizen' | 'Agency' | 'Admin';

// Base User Interface
export interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  date_registered: string;
}

// Citizen Interface
export interface Citizen extends BaseUser {
  citizen_id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  role: 'Citizen';
}

// Agency Interface
export interface Agency extends BaseUser {
  _id: string;
  agency_name: string;
  agency_code: string;
  contact_email: string;
  contact_phone: string;
  department?: string;
  address: string;
  isPending: boolean;
  agency_web3_account?: any;
  role: 'Agency';
}

// Admin Interface
export interface Admin extends BaseUser {
  admin_id: string;
  first_name: string;
  last_name: string;
  agency_web3_account?: any;
  role: 'Admin';
}

// Union type for all users
export type User = Citizen | Agency | Admin;

// Authentication Requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCitizenRequest {
  role: 'Citizen';
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
}

export interface RegisterAgencyRequest {
  role: 'Agency';
  agency_name: string;
  agency_code: string;
  contact_email: string;
  password: string;
  contact_phone: string;
  department?: string;
  address: string;
}

export interface RegisterAdminRequest {
  role: 'Admin';
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export type RegisterRequest = RegisterCitizenRequest | RegisterAgencyRequest | RegisterAdminRequest;

// Authentication Responses
export interface AuthResponse {
  message: string;
  users: {
    token: string;
    role: UserRole;
  };
  redirect: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

// JWT Payload
export interface JWTPayload {
  id: string;
  email: string;
  verified: boolean;
  role: UserRole;
  exp: number;
}