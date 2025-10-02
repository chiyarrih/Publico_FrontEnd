# Quick Start - Authentication Guide

## Test Credentials

### Admin Account
```
Email: doriacharry@gmail.com
Password: Admin12345!
Dashboard: http://localhost:3000/admin/dashboard
```

### Test Citizen (Create via Signup)
```
Role: Citizen
Required: first_name, last_name, email, password
Dashboard: http://localhost:3000/citizen/dashboard
```

### Test Agency (Create via Signup)
```
Role: Agency
Required: agency_name, agency_code, email, password, contact_phone, address
Dashboard: http://localhost:3000/agency/dashboard
```

## Starting the Application

### Backend (Port 5000)
```bash
cd Publico_BackEnd
npm install
npm run dev
```

### Frontend (Port 3000)
```bash
cd Publico_FrontEnd/publico-frontend
npm install
npm run dev
```

## API Endpoints Reference

### Authentication

#### Register User
```http
POST http://localhost:5000/auth/user/register
Content-Type: application/json

{
  "role": "Citizen",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "doriacharry@gmail.com",
  "password": "Admin12345!"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "Admin",
  "user_id": "507f1f77bcf86cd799439011",
  "redirect": "/admin/dashboard",
  "privateKey": "encrypted_key",
  "address": "0x123...",
  "name": "Admin"
}
```

#### Verify Email
```http
GET http://localhost:5000/auth/verifyEmail2/{token}
```

#### Forgot Password
```http
POST http://localhost:5000/auth/sendResetPassword
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST http://localhost:5000/auth/changePassword
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecurePass123!"
}
```

## Password Requirements

Password must contain:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character (@$!%*?&-_.)

Example valid password: `SecurePass123!`

## Common Issues & Solutions

### Issue: "User not found"
**Solution**: Make sure user is registered. Admin is auto-seeded on server start.

### Issue: "Email not verified"
**Solution**: Check email for verification link or verify manually in database.

### Issue: "Invalid token"
**Solution**: Token expired (1 hour expiry). Please login again.

### Issue: CORS error
**Solution**: Backend allows localhost:3000 and localhost:3001. Check app.js CORS config.

### Issue: Cannot connect to MongoDB
**Solution**: Ensure MongoDB is running and MONGO_URI is correct in .env

### Issue: Redis connection error
**Solution**: Ensure Redis is running. Check Redis config in .env

## Frontend Usage Examples

### Using useAuth Hook
```typescript
import { useAuth } from '../controller/citizen/hooks/useAuth';

function MyComponent() {
  const { login, register, logout, isLoading, error, user } = useAuth();
  
  // Login
  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'SecurePass123!'
    });
  };
  
  // Register Citizen
  const handleRegisterCitizen = async () => {
    await register({
      role: 'Citizen',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'SecurePass123!'
    });
  };
  
  // Register Agency
  const handleRegisterAgency = async () => {
    await register({
      role: 'Agency',
      agency_name: 'Department of Health',
      agency_code: 'DOH',
      email: 'doh@gov.ph',
      password: 'SecurePass123!',
      contact_phone: '+639123456789',
      department: 'Public Health',
      address: '123 Main St'
    });
  };
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {user && <p>Welcome, {user.email}!</p>}
    </div>
  );
}
```

### Protected Routes
```typescript
import { ProtectedRoute, AdminRoute, AgencyRoute, CitizenRoute } from './routes/ProtectedRoute';

// Citizen only
<CitizenRoute>
  <CitizenDashboard />
</CitizenRoute>

// Agency only
<AgencyRoute>
  <AgencyDashboard />
</AgencyRoute>

// Admin only
<AdminRoute>
  <AdminDashboard />
</AdminRoute>

// Multiple roles
<ProtectedRoute allowedRoles={['Admin', 'Agency']}>
  <BudgetManagement />
</ProtectedRoute>
```

### Checking Auth Status
```typescript
import { isAuthenticated, getCurrentUserRole, hasRole } from '../utils/auth';

// Check if user is logged in
if (isAuthenticated()) {
  console.log('User is authenticated');
}

// Get current user role
const role = getCurrentUserRole(); // 'Admin' | 'Agency' | 'Citizen' | null

// Check if user has specific role
if (hasRole(['Admin', 'Agency'])) {
  console.log('User is Admin or Agency');
}
```

## Development Tools

### Check JWT Token
Visit https://jwt.io and paste your token to decode and verify payload:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "verified": true,
  "role": "Citizen",
  "exp": 1234567890
}
```

### Clear Auth State
```javascript
// In browser console
localStorage.clear();
```

## Next Steps

1. ✅ Authentication system is fully integrated
2. ⏭️ Test all user flows (Citizen, Agency, Admin)
3. ⏭️ Implement forgot password UI pages
4. ⏭️ Add email verification success page
5. ⏭️ Implement profile management
6. ⏭️ Add agency approval workflow for admins

## Support

For issues or questions, check:
- `AUTH_MIGRATION_SUMMARY.md` - Detailed migration documentation
- Backend logs in terminal running `npm run dev`
- Frontend console for client-side errors
- Network tab for API request/response inspection


