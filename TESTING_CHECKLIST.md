# Authentication Testing Checklist

Use this checklist to verify all authentication features are working correctly after the migration.

## Pre-Testing Setup

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000  
- [ ] MongoDB connected
- [ ] Redis connected
- [ ] Email service configured (for verification emails)
- [ ] Ganache/local blockchain running on port 7545 (for Web3 accounts)

## 1. Admin Authentication

### Login
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Select "Agency Representative" portal (Admin uses same flow)
- [ ] Enter email: `doriacharry@gmail.com`
- [ ] Enter password: `Admin12345!`
- [ ] Click "Log In"
- [ ] **Expected**: Redirect to `/admin/dashboard`
- [ ] **Expected**: Token stored in localStorage
- [ ] **Expected**: User can access admin-only routes

### Token Validation
- [ ] Open browser DevTools > Application > Local Storage
- [ ] Check `publico_auth_token` exists
- [ ] Copy token and decode at https://jwt.io
- [ ] **Expected**: Payload contains `role: "Admin"`
- [ ] **Expected**: Token expiry is 1 hour from now

### Logout
- [ ] Click logout button (if available)
- [ ] **Expected**: Redirect to `/login`
- [ ] **Expected**: Token removed from localStorage
- [ ] **Expected**: Cannot access protected routes

## 2. Citizen Registration & Authentication

### Registration
- [ ] Navigate to `http://localhost:3000/signup`
- [ ] Select "Citizen" role
- [ ] Fill in form:
  ```
  First Name: John
  Last Name: Doe
  Email: john.doe@test.com
  Password: TestPass123!
  Confirm Password: TestPass123!
  ```
- [ ] Check "I agree to terms and conditions"
- [ ] Click "Sign Up"
- [ ] **Expected**: Success message or redirect to login
- [ ] **Expected**: Verification email sent

### Email Verification
- [ ] Check email inbox for verification link
- [ ] Click verification link or manually navigate to:
  ```
  http://localhost:5000/auth/verifyEmail2/{token}
  ```
- [ ] **Expected**: "Email verified successfully" message
- [ ] **Expected**: User `isVerified` set to `true` in database

### Login (Before Verification)
- [ ] Try to login with unverified account
- [ ] **Expected**: Error "Please verify your email before logging in"

### Login (After Verification)
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Select "Citizen" portal
- [ ] Enter citizen credentials
- [ ] Click "Log In"
- [ ] **Expected**: Redirect to `/citizen/dashboard`
- [ ] **Expected**: Token contains `role: "Citizen"`

### Access Control
- [ ] Try to access `/admin/dashboard`
- [ ] **Expected**: Redirect to `/unauthorized` or `/login`
- [ ] Try to access `/agency/dashboard`
- [ ] **Expected**: Redirect to `/unauthorized` or `/login`

## 3. Agency Registration & Authentication

### Registration
- [ ] Navigate to `http://localhost:3000/signup`
- [ ] Select "Agency Representative" role
- [ ] Fill in form:
  ```
  Agency Name: Department of Transportation
  Agency Code: DOT
  Contact Phone: +639123456789
  Department: Infrastructure
  Address: 123 Gov't Center, Manila
  Representative First Name: Jane
  Representative Last Name: Smith
  Email: jane.smith@dot.gov.ph
  Password: AgencyPass123!
  Confirm Password: AgencyPass123!
  ```
- [ ] Check "I agree to terms and conditions"
- [ ] Click "Sign Up"
- [ ] **Expected**: Success message or redirect to login
- [ ] **Expected**: Verification email sent
- [ ] **Expected**: Web3 account auto-created

### Email Verification
- [ ] Check email inbox for verification link
- [ ] Click verification link
- [ ] **Expected**: Email verified successfully

### Login
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Select "Agency Representative" portal
- [ ] Enter agency credentials
- [ ] Click "Log In"
- [ ] **Expected**: Redirect to `/agency/dashboard`
- [ ] **Expected**: Token contains `role: "Agency"`
- [ ] **Expected**: Response includes `privateKey` and `address`

### Web3 Account
- [ ] After login, check if Web3 account details are accessible
- [ ] **Expected**: Agency has `agency_web3_account.address`
- [ ] **Expected**: Agency has encrypted `agency_web3_account.privateKey`

### Access Control
- [ ] Try to access `/citizen/dashboard`
- [ ] **Expected**: Redirect to `/unauthorized` or `/login`
- [ ] Try to access admin-only routes
- [ ] **Expected**: Redirect to `/unauthorized` or `/login`

## 4. Password Reset Flow

### Request Reset Code
- [ ] Navigate to login page
- [ ] Click "Forgot password?"
- [ ] Enter email address
- [ ] Submit form
- [ ] **Expected**: "Reset code sent to email" message
- [ ] **Expected**: Email received with 6-digit code

### Reset Password
- [ ] Enter email address
- [ ] Enter reset code from email
- [ ] Enter new password: `NewPassword123!`
- [ ] Confirm new password
- [ ] Submit form
- [ ] **Expected**: "Password reset successful" message

### Login with New Password
- [ ] Navigate to login page
- [ ] Enter email and NEW password
- [ ] Click "Log In"
- [ ] **Expected**: Login successful

### Old Password Should Fail
- [ ] Logout
- [ ] Try to login with OLD password
- [ ] **Expected**: "Invalid password" error

## 5. Form Validation

### Email Validation
- [ ] Try invalid email formats:
  - [ ] `notanemail`
  - [ ] `test@`
  - [ ] `@test.com`
- [ ] **Expected**: Email validation error

### Password Validation
- [ ] Try weak passwords:
  - [ ] `short` (too short)
  - [ ] `alllowercase123!` (no uppercase)
  - [ ] `ALLUPPERCASE123!` (no lowercase)
  - [ ] `NoNumbers!` (no numbers)
  - [ ] `NoSpecialChars123` (no special chars)
- [ ] **Expected**: Password validation error with helpful message

### Required Fields
- [ ] Leave required fields empty
- [ ] Try to submit form
- [ ] **Expected**: Required field errors

## 6. API Response Testing

### Registration Response
```bash
curl -X POST http://localhost:5000/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Citizen",
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```
- [ ] **Expected**: Status 200
- [ ] **Expected**: Response contains `message`, `user`, `redirect`

### Login Response
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doriacharry@gmail.com",
    "password": "Admin12345!"
  }'
```
- [ ] **Expected**: Status 200
- [ ] **Expected**: Response contains:
  - [ ] `token` (JWT string)
  - [ ] `role` ("Admin")
  - [ ] `user_id` (MongoDB ObjectId)
  - [ ] `redirect` ("/admin/dashboard")
  - [ ] `privateKey` (encrypted)
  - [ ] `address` (Ethereum address)
  - [ ] `name` ("Admin")

## 7. Security Testing

### JWT Expiration
- [ ] Login successfully
- [ ] Wait 1 hour (or modify expiry in code for faster testing)
- [ ] Try to access protected route
- [ ] **Expected**: Redirect to login (token expired)

### Protected Routes Without Auth
- [ ] Clear localStorage
- [ ] Try to access `/citizen/dashboard`
- [ ] **Expected**: Redirect to `/login`
- [ ] Try to access `/agency/dashboard`
- [ ] **Expected**: Redirect to `/login`
- [ ] Try to access `/admin/dashboard`
- [ ] **Expected**: Redirect to `/login`

### Role-Based Access
- [ ] Login as Citizen
- [ ] Try to access `/admin/dashboard`
- [ ] **Expected**: Redirect to `/unauthorized`

### CORS
- [ ] Try to call API from unauthorized origin
- [ ] **Expected**: CORS error (unless origin is localhost:3000 or localhost:3001)

## 8. Edge Cases

### Duplicate Email
- [ ] Try to register with existing email
- [ ] **Expected**: "Email already exists" error

### Invalid Reset Code
- [ ] Request password reset
- [ ] Enter wrong reset code
- [ ] **Expected**: "Invalid code" error

### Expired Reset Code
- [ ] Request password reset
- [ ] Wait 1 hour
- [ ] Try to use reset code
- [ ] **Expected**: "Reset code expired" error

### Case Sensitivity
- [ ] Register with `Test@Example.com`
- [ ] Try to login with `test@example.com`
- [ ] **Expected**: Should work (emails are case-insensitive in MongoDB)

## 9. Database Verification

### User Document Structure
- [ ] Open MongoDB Compass or mongo shell
- [ ] Check `users` collection
- [ ] Verify citizen document has:
  - [ ] `email`
  - [ ] `password` (hashed)
  - [ ] `role: "Citizen"`
  - [ ] `citizen_id`
  - [ ] `first_name`
  - [ ] `last_name`
  - [ ] `isVerified`
  
- [ ] Verify agency document has:
  - [ ] `email`
  - [ ] `password` (hashed)
  - [ ] `role: "Agency"`
  - [ ] `agency_id`
  - [ ] `agency_name`
  - [ ] `agency_code`
  - [ ] `contact_phone`
  - [ ] `agency_web3_account.address`
  - [ ] `agency_web3_account.privateKey` (encrypted)
  - [ ] `isPending: true`

## 10. UI/UX Testing

### Loading States
- [ ] Check loading indicators appear during API calls
- [ ] **Expected**: Button shows "Logging in..." or similar

### Error Messages
- [ ] Trigger various errors
- [ ] **Expected**: User-friendly error messages displayed
- [ ] **Expected**: Errors clear when user corrects input

### Success Messages
- [ ] Complete successful registration
- [ ] **Expected**: Success message or redirect with feedback

### Responsive Design
- [ ] Test on mobile viewport
- [ ] **Expected**: Forms are usable on small screens

## Test Results Summary

Date: _______________
Tester: _______________

### Pass/Fail Count
- Total Tests: _____ 
- Passed: _____ 
- Failed: _____ 

### Critical Issues
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes
_______________________________________________________
_______________________________________________________
_______________________________________________________

## Next Steps After Testing

- [ ] Fix any failed tests
- [ ] Document any bugs found
- [ ] Update this checklist if new test cases discovered
- [ ] Proceed with next feature development


