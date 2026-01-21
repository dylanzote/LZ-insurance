# Backend Integration Guide

## Overview

The LZ Insurance mobile app is now integrated with the backend User Service (port 8081). This document explains the integration, configuration, and testing procedures.

## Architecture

```
Mobile App (React Native/Expo)
    ↓ HTTP/REST API
User Service (Spring Boot - Port 8081)
    ↓ Kafka Events
Notification Service (Spring Boot - Port 8086)
```

## Changes Made

### 1. Backend Type Definitions (`core/types/backend.ts`)

Created comprehensive TypeScript interfaces matching the Java DTOs exactly:

- **Auth Types**: `AuthRequest`, `AuthResponse`, `PasswordResetRequest`
- **User Types**: `UserResponse`, `CreateUserRequest`, `RoleResponse`
- **Enums**: `Gender`, `Language`, `UserStatus`, `TwoFacMethod`

### 2. API Configuration

Updated API base URL to point to User Service:

**Files Modified:**
- `core/constants/app.ts`
- `core/config/defaultConfig.ts`

**Configuration:**
```typescript
apiUrl: 'http://localhost:8081'  // User Service
notificationApiUrl: 'http://localhost:8086'  // Notification Service (future)
```

### 3. Authentication Service (`services/api/auth.ts`)

Replaced mock implementation with real API endpoints:

**Endpoints Implemented:**
- `POST /authenticate` - Login
- `POST /user/register` - Customer registration
- `POST /auth/refresh-token` - Token refresh
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Email verification
- `GET /auth/password-policy` - Get password policy

**Key Features:**
- Automatic CUSTOMER role assignment during registration
- Token management (access + refresh tokens)
- Password validation

### 4. Auth Store (`core/store/useAuthStore.ts`)

Enhanced Zustand store with:
- Real JWT token management
- Automatic token refresh
- Persistent authentication state (AsyncStorage)
- Error handling and retry logic

**State Structure:**
```typescript
{
  user: UserResponse | null,
  tokens: {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    refreshExpiresIn: number
  },
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

### 5. Auth Context (`contexts/AuthContext.tsx`)

Updated to expose register function and error handling:
```typescript
{
  login: (email, password) => Promise<void>,
  register: (userData) => Promise<void>,
  logout: () => Promise<void>,
  clearError: () => void
}
```

### 6. Registration Screen (`features/auth/screens/RegisterScreen.tsx`)

Enhanced registration form with all required backend fields:

**Fields Added:**
- `dateOfBirth` - YYYY-MM-DD format (converted to dd/MM/yyyy)
- `gender` - MALE | FEMALE | OTHER
- `town` - Town/City
- `address` - Full address

**Validation:**
- Required fields validation
- Password strength requirements
- Phone number format validation
- Date format validation

### 7. Translations

Added new translation keys to:
- `core/i18n/en.json` - English
- `core/i18n/fr.json` - French

**New Keys:**
- `auth.dateOfBirth`, `auth.gender`, `auth.selectGender`
- `auth.town`, `auth.address`
- `auth.enterTown`, `auth.enterAddress`

## Configuration Steps

### Development Environment

1. **Set Environment Variables** (Optional)

Create `.env` file in project root:
```bash
EXPO_PUBLIC_API_URL=http://localhost:8081
EXPO_PUBLIC_NOTIFICATION_API_URL=http://localhost:8086
```

2. **For Android Emulator**

If running backend on localhost:
```bash
# Use 10.0.2.2 instead of localhost for Android emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:8081
```

3. **For Physical Device**

Use your computer's local network IP:
```bash
# Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
EXPO_PUBLIC_API_URL=http://192.168.1.xxx:8081
```

### Production Environment

Update the default values in `core/constants/app.ts`:
```typescript
apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.lz-insurance.com'
```

## Testing Guide

### Prerequisites

1. **Backend Services Running:**
   - User Service on port 8081
   - Notification Service on port 8086 (optional for now)

2. **Database Setup:**
   - Ensure CUSTOMER role exists in the database
   - Role should have `isCustomerRole: true` OR `name: 'CUSTOMER'`

### Test Scenarios

#### 1. User Registration (Create Customer)

**Steps:**
1. Open mobile app
2. Navigate to Registration screen
3. Fill in all required fields:
   ```
   First Name: John
   Last Name: Doe
   Email: john.doe@example.com
   Phone: +1234567890
   Date of Birth: 1990-01-15 (YYYY-MM-DD)
   Gender: MALE
   Town: Toronto
   Address: 123 Main Street
   Password: Password123!
   Confirm Password: Password123!
   ```
4. Tap "Create Account"

**Expected Result:**
- User created with CUSTOMER role
- Auto-login after registration
- Redirected to main app (Dashboard)
- User data stored in AsyncStorage

**Backend Verification:**
```bash
# Check user was created
GET http://localhost:8081/user/get-all

# User should have:
- roles: [{ name: "CUSTOMER", isCustomerRole: true }]
- status: "PENDING" or "ACTIVE"
- emailConfirmed: false
```

#### 2. User Login

**Steps:**
1. Logout if logged in
2. Navigate to Login screen
3. Enter credentials:
   ```
   Email: john.doe@example.com
   Password: Password123!
   ```
4. Tap "Sign In"

**Expected Result:**
- Successful authentication
- JWT tokens stored
- User data loaded
- Redirected to Dashboard

**Backend Verification:**
```bash
# Check auth response contains:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600,
  "refreshExpiresIn": 86400,
  "user": {
    "id": "...",
    "email": "john.doe@example.com",
    ...
  }
}
```

#### 3. Admin Panel Synchronization

**Steps:**
1. Create customer via mobile app (as above)
2. Open admin panel: `http://localhost:5173/customers`
3. Refresh customer list

**Expected Result:**
- New customer appears in admin panel
- All fields populated correctly:
  - Name, Email, Phone
  - Date of Birth, Gender, Town, Address
  - Status (PENDING/ACTIVE)
  - Created timestamp

#### 4. Cross-Platform Data Sync

**Scenario A: Admin creates customer → Mobile login**
1. Admin creates customer in admin panel
2. Customer receives email (if notification service running)
3. Customer sets password via link
4. Customer logs in via mobile app
5. All data visible in mobile profile

**Scenario B: Mobile registration → Admin views**
1. Customer registers via mobile
2. Admin views new customer in admin panel
3. Customer data fully synchronized
4. Admin can manage customer (suspend, activate, delete)

### Error Handling Tests

#### 1. Invalid Credentials
**Input:** Wrong email or password
**Expected:** Error message: "Invalid credentials"

#### 2. Duplicate Email
**Input:** Register with existing email
**Expected:** Error message: "Email already exists"

#### 3. Network Error
**Input:** Stop backend service, attempt login
**Expected:** Error message: "Network error. Please check your connection."

#### 4. Validation Errors
**Input:** Invalid phone format, weak password, etc.
**Expected:** Field-level validation errors displayed

## API Flow Diagrams

### Registration Flow
```
Mobile App
    ↓ POST /role/get-all
User Service (Get CUSTOMER role ID)
    ↓ Response: [{ id: "xxx", name: "CUSTOMER" }]
Mobile App
    ↓ POST /user/register (with CUSTOMER role ID)
User Service
    ↓ Create user with CUSTOMER role
    ↓ Publish UserCreatedEvent
Kafka
    ↓ Consume event
Notification Service
    ↓ Send welcome email
    ↓ (Optional) Send verification email
```

### Login Flow
```
Mobile App
    ↓ POST /authenticate
User Service
    ↓ Validate credentials
    ↓ Generate JWT tokens
    ↓ Return AuthResponse
Mobile App
    ↓ Store tokens in AsyncStorage
    ↓ Store user in Zustand
    ↓ Add Authorization header to all requests
    ↓ Navigate to Dashboard
```

### Token Refresh Flow
```
API Request
    ↓ 401 Unauthorized (token expired)
Auth Store
    ↓ POST /auth/refresh-token
User Service
    ↓ Validate refresh token
    ↓ Generate new tokens
    ↓ Return new AuthResponse
Auth Store
    ↓ Update stored tokens
    ↓ Retry original request
```

## Security Features

### 1. Token Management
- Access tokens (short-lived: ~1 hour)
- Refresh tokens (long-lived: ~24 hours)
- Automatic token refresh on expiry
- Secure storage in AsyncStorage

### 2. Request Interceptors
- Automatic Authorization header injection
- Retry logic with exponential backoff
- Error transformation and handling

### 3. Password Security
- Minimum 8 characters
- Requires uppercase, lowercase, digit
- Backend validation against common passwords
- Password strength indicator (future)

## Troubleshooting

### Common Issues

#### 1. "Network Error" on Android Emulator
**Cause:** localhost doesn't work on emulators
**Solution:** Use `http://10.0.2.2:8081` instead

#### 2. "Customer role not found"
**Cause:** CUSTOMER role doesn't exist in database
**Solution:** Run database migration or create role manually:
```sql
INSERT INTO roles (id, name, is_customer_role) 
VALUES ('xxx', 'CUSTOMER', true);
```

#### 3. CORS Errors
**Cause:** Backend CORS configuration
**Solution:** Ensure User Service allows mobile app origin:
```java
@CrossOrigin(origins = "*", allowedHeaders = "*")
```

#### 4. Token Expired Immediately
**Cause:** Time sync issue
**Solution:** Check device/server time synchronization

## Next Steps

### 1. Notification Service Integration
- Push notification registration
- In-app notifications
- Email notifications for password reset

### 2. Additional Features
- Biometric authentication enhancement
- Offline mode support
- Profile management (update, upload avatar)
- Password change
- 2FA setup

### 3. Production Readiness
- SSL/TLS configuration
- API key management
- Error logging and monitoring
- Performance optimization

## Support

For issues or questions:
1. Check backend logs: `lz-insurance/logs/`
2. Check mobile logs: Expo DevTools console
3. Verify network connectivity: `ping localhost:8081`
4. Test endpoints directly: Postman/curl

## Code Quality

All code follows:
- ✅ Clean code principles
- ✅ TypeScript strict mode
- ✅ Production-ready error handling
- ✅ Comprehensive documentation
- ✅ Consistent naming conventions
- ✅ Proper separation of concerns
