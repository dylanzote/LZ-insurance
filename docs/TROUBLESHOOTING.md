# Troubleshooting Guide

## Authentication Issues

### Problem: App redirects to dashboard without login

**Symptom**: When launching the app for the first time (or after reinstalling), you're immediately redirected to the dashboard even though you haven't logged in.

**Cause**: Stale authentication data persisted in AsyncStorage from previous sessions.

**Solutions**:

#### Solution 1: Clear App Data (Recommended for Testing)

**For iOS Simulator:**
```bash
# Stop the app first
# Then run:
npx expo start --clear
```

**For Android Emulator:**
```bash
# Stop the app first
# Settings > Apps > LZ Insurance > Storage > Clear Data
# Or run:
npx expo start --clear
```

**For Physical Devices:**
- **iOS**: Delete and reinstall the app
- **Android**: Settings > Apps > LZ Insurance > Storage > Clear Storage

#### Solution 2: Add Debug Clear Storage Button

Add a temporary button in your app to clear storage during development:

```typescript
// In any screen (e.g., LoginScreen or SettingsScreen)
import { clearAuthStorage } from '@/core/utils/clearAuthStorage';

// Add a button:
<Button
  title="Clear Auth Storage (Debug)"
  onPress={async () => {
    await clearAuthStorage();
    // Reload app or navigate to login
  }}
/>
```

#### Solution 3: Reset Expo Dev Client

```bash
# Clear all Expo caches and start fresh
npx expo start --clear
```

### Problem: "Invalid persisted state detected" in console

**Symptom**: You see console warnings about invalid persisted state.

**Cause**: The app detected inconsistent authentication data (e.g., tokens without user data, or vice versa).

**Solution**: This is actually the app working correctly! It automatically clears the invalid state. Just restart the app and it should work properly.

---

## Backend Connection Issues

### Problem: Network Error when trying to login

**Symptom**: Login fails with "Network error" or timeout.

**Possible Causes & Solutions**:

#### 1. Backend not running
```bash
# Check if User Service is running on port 8081
curl http://localhost:8081/actuator/health

# If not, start the backend services
```

#### 2. Wrong API URL

**For Android Emulator:**
```typescript
// core/constants/app.ts
apiUrl: 'http://10.0.2.2:8081' // NOT localhost
```

**For iOS Simulator:**
```typescript
// core/constants/app.ts
apiUrl: 'http://localhost:8081' // OK
```

**For Physical Device:**
```typescript
// Find your computer's IP: ipconfig (Windows) or ifconfig (Mac/Linux)
apiUrl: 'http://192.168.1.XXX:8081' // Use your actual IP
```

#### 3. Firewall blocking connection
- Temporarily disable firewall
- Or add exception for ports 8081 and 8086

---

## Registration Issues

### Problem: "Customer role not found" error

**Symptom**: Registration fails with error about customer role.

**Solution**: Ensure CUSTOMER role exists in database:

```sql
-- Check roles
SELECT * FROM roles;

-- Create CUSTOMER role if missing
INSERT INTO roles (id, name, is_customer_role, description)
VALUES (gen_random_uuid(), 'CUSTOMER', true, 'Customer role for mobile users');
```

### Problem: Registration succeeds but can't login

**Symptom**: User created successfully but login fails.

**Possible Causes**:
1. Email not verified (check `email_confirmed` field)
2. User status is PENDING or INACTIVE
3. Password encoding mismatch

**Solution**:
```sql
-- Check user status
SELECT id, email, status, email_confirmed FROM users WHERE email = 'your@email.com';

-- Activate user if needed
UPDATE users SET status = 'ACTIVE', email_confirmed = true WHERE email = 'your@email.com';
```

---

## Token/Session Issues

### Problem: Token expires immediately after login

**Symptom**: Login succeeds but immediately logged out.

**Cause**: Token expiration time mismatch or invalid token.

**Solution**:
1. Check backend token configuration
2. Verify system time is synchronized
3. Check token expiry in response (should be ~3600 seconds)

### Problem: App doesn't auto-refresh expired tokens

**Symptom**: Gets 401 errors and doesn't retry.

**Solution**: The auto-refresh is built into the interceptor. Check:
```typescript
// services/api/interceptors.ts
// Should automatically call refreshToken on 401
```

If not working, manually logout and login again.

---

## Development Tips

### Clear Everything and Start Fresh

```bash
# 1. Stop the app
# 2. Clear caches
npx expo start --clear

# 3. Clear AsyncStorage (add button in app or reinstall)

# 4. Restart backend services

# 5. Restart app
```

### View AsyncStorage Contents

Add this debug code temporarily:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// View all storage
AsyncStorage.getAllKeys().then(keys => {
  AsyncStorage.multiGet(keys).then(stores => {
    console.log('AsyncStorage contents:', stores);
  });
});
```

### Enable Debug Logs

```typescript
// core/store/useAuthStore.ts
// Add logging in login/logout functions
console.log('Login attempt:', { email });
console.log('Login success:', { user, tokens });
console.log('Logout:', { user: get().user });
```

---

## Common Error Messages

### "Your session has expired. Please login again."
- **Cause**: Access token expired and refresh token also expired
- **Solution**: Just login again (this is normal after ~24 hours)

### "Too many login attempts"
- **Cause**: Rate limiting triggered (5 attempts per 5 minutes)
- **Solution**: Wait 5 minutes and try again

### "Invalid credentials"
- **Cause**: Wrong email or password
- **Solution**: Double-check credentials or use password reset

### "Network error. Please check your connection."
- **Cause**: Cannot reach backend or network issues
- **Solution**: Check API URL configuration and backend status

---

## Still Having Issues?

### Logs to Check

1. **Mobile App Logs**: Expo DevTools console
2. **Backend Logs**: `lz-insurance/logs/user-service.log`
3. **Network Logs**: Use React Native Debugger or Flipper

### Debug Checklist

- [ ] Backend services running (ports 8081, 8086)
- [ ] Correct API URL in mobile app
- [ ] No firewall blocking connections
- [ ] CUSTOMER role exists in database
- [ ] AsyncStorage cleared (no stale data)
- [ ] App restarted with --clear flag
- [ ] Latest code pulled/built
- [ ] Dependencies installed (`npm install`)

### Report an Issue

If none of the above helps, provide:
1. Error message (exact text)
2. Steps to reproduce
3. Platform (iOS/Android/Simulator/Physical)
4. Backend logs
5. Mobile console logs
