# Quick Test Guide - Mobile App Backend Integration

## Prerequisites Checklist

- [ ] User Service running on port 8081
- [ ] Notification Service running on port 8086 (optional for basic tests)
- [ ] Admin Panel running on port 5173
- [ ] CUSTOMER role exists in database

---

## Test Scenario 1: Customer Registration (5 minutes)

### Step 1: Register New Customer

**Mobile App:**
```
1. Open app → Register screen
2. Fill in:
   First Name: Test
   Last Name: Customer  
   Email: test.customer@example.com
   Phone: +1234567890
   DOB: 1990-01-15
   Gender: MALE
   Town: Toronto
   Address: 123 Test Street
   Password: TestPass123!
   Confirm: TestPass123!
3. Tap "Create Account"
4. ✅ Should auto-login to Dashboard
```

### Step 2: Verify in Admin Panel

```
1. Open: http://localhost:5173/customers
2. ✅ New customer "Test Customer" should appear
3. ✅ Email: test.customer@example.com
4. ✅ Status: PENDING or ACTIVE
5. ✅ All fields populated correctly
```

### Step 3: Test Login

```
1. Logout from mobile
2. Login with:
   Email: test.customer@example.com
   Password: TestPass123!
3. ✅ Should login successfully
```

**Expected Time:** ~2 minutes
**Status:** ✅ PASS / ❌ FAIL

---

## Test Scenario 2: Profile Management (3 minutes)

### Step 1: View Profile

```
1. Login to mobile app
2. Navigate to Profile tab
3. ✅ All user data displayed correctly
```

### Step 2: Update Profile

```
1. Tap "Edit Profile"
2. Change:
   Town: Montreal
   Address: 456 New Street
3. Save
4. ✅ Changes saved successfully
```

### Step 3: Verify Changes

```
# In Admin Panel
1. Refresh customer list
2. View customer details
3. ✅ Town and Address updated
```

**Expected Time:** ~1 minute
**Status:** ✅ PASS / ❌ FAIL

---

## Test Scenario 3: Password Change (2 minutes)

### Step 1: Change Password

```
1. Profile → Change Password
2. Enter:
   Old: TestPass123!
   New: NewPass123!
   Confirm: NewPass123!
3. Submit
4. ✅ Success message shown
```

### Step 2: Verify New Password

```
1. Logout
2. Try old password → ❌ Should fail
3. Try new password → ✅ Should work
```

**Expected Time:** ~1 minute
**Status:** ✅ PASS / ❌ FAIL

---

## Test Scenario 4: Two-Factor Authentication (5 minutes)

**Note:** Requires Notification Service running

### Step 1: Enable 2FA

```
1. Profile → Security Settings
2. Enable 2FA
3. Choose method: EMAIL or SMS
4. ✅ Verification code sent
5. Enter code from email/SMS
6. ✅ 2FA enabled
7. ✅ Backup codes displayed
8. Save backup codes securely
```

### Step 2: Test 2FA Login

```
1. Logout
2. Login with credentials
3. ✅ 2FA code required
4. Enter code from email/SMS
5. ✅ Login successful
```

### Step 3: Test Backup Code

```
1. Logout
2. Login with credentials
3. ✅ 2FA code required
4. Use backup code instead
5. ✅ Login successful
6. ✅ Backup code marked as used
```

**Expected Time:** ~3 minutes
**Status:** ✅ PASS / ❌ FAIL

---

## Test Scenario 5: Push Notifications (3 minutes)

**Note:** Requires Notification Service running + Physical device or emulator

### Step 1: Register Device

```
1. Login to mobile app
2. Grant notification permissions
3. ✅ Device auto-registered
```

### Step 2: Verify Registration

```
# API Call
GET http://localhost:8086/notification/devices/my-devices

# Expected Response:
[{
  "id": "xxx",
  "deviceId": "xxx",
  "platform": "ANDROID" or "IOS",
  "pushToken": "ExponentPushToken[xxx]",
  "isActive": true
}]
```

### Step 3: Test Notification

```
# Send test notification via Postman/curl
POST http://localhost:8086/notification/notifications/send
Headers: Authorization: Bearer <token>
Body:
{
  "userId": "<your-user-id>",
  "title": "Test Notification",
  "message": "This is a test message",
  "channel": "PUSH",
  "type": "GENERAL",
  "priority": "NORMAL"
}

# On Mobile:
✅ Push notification received
✅ Appears in notification list
✅ Unread count incremented
```

**Expected Time:** ~2 minutes
**Status:** ✅ PASS / ❌ FAIL

---

## Test Scenario 6: Admin-Created Customer Login (3 minutes)

### Step 1: Create Customer in Admin

```
1. Admin Panel → Customers → New Customer
2. Fill in all details
3. Create
4. ✅ Customer created
5. ✅ Password reset email sent (if notification service running)
```

### Step 2: Set Password (If applicable)

```
1. Click link in email
2. Set password
3. ✅ Password set successfully
```

### Step 3: Login via Mobile

```
1. Open mobile app
2. Login with admin-created credentials
3. ✅ Should login successfully
4. ✅ All data visible in profile
```

**Expected Time:** ~2 minutes
**Status:** ✅ PASS / ❌ FAIL

---

## Common Test Issues & Solutions

### Issue 1: "Network Error"
```bash
Problem: Can't connect to backend
Solution:
- Check backend running: curl http://localhost:8081/actuator/health
- For Android emulator: Use http://10.0.2.2:8081
- For physical device: Use http://192.168.x.x:8081
```

### Issue 2: "Customer role not found"
```bash
Problem: No CUSTOMER role in database
Solution:
- Check roles: GET http://localhost:8081/role/get-all
- Create if missing (use admin panel or API)
```

### Issue 3: "Invalid credentials"
```bash
Problem: Can't login
Solution:
- Verify user exists: GET http://localhost:8081/user/get-all
- Check password correct
- Verify user status is ACTIVE
```

### Issue 4: "2FA code not received"
```bash
Problem: Verification code not arriving
Solution:
- Check notification service running
- Verify email/SMS provider configured
- Check backend logs
- Verify correct email/phone in profile
```

---

## Quick Health Check

Run these to verify services are healthy:

```bash
# User Service
curl http://localhost:8081/actuator/health
# Expected: {"status":"UP"}

# Notification Service  
curl http://localhost:8086/actuator/health
# Expected: {"status":"UP"}

# Get all roles (check CUSTOMER exists)
curl http://localhost:8081/role/get-all
# Expected: [{...name:"CUSTOMER", isCustomerRole:true}]
```

---

## Test Result Summary

| Test Scenario | Expected Time | Status | Notes |
|--------------|---------------|--------|-------|
| Customer Registration | 2 min | ⬜ | Basic flow |
| Profile Management | 1 min | ⬜ | CRUD operations |
| Password Change | 1 min | ⬜ | Security |
| Two-Factor Auth | 3 min | ⬜ | Requires notifications |
| Push Notifications | 2 min | ⬜ | Requires notifications |
| Admin-Created Login | 2 min | ⬜ | Cross-platform sync |

**Total Test Time:** ~15 minutes
**Services Required:** User Service (required), Notification Service (optional)

---

## Success Criteria

✅ All customers created in mobile appear in admin panel
✅ All customers created in admin can login via mobile  
✅ Profile updates sync between mobile and admin
✅ Password changes work correctly
✅ 2FA setup and verification working
✅ Push notifications received on device
✅ All user data persists correctly
✅ No console errors during normal operation

---

## Need Help?

**Check Logs:**
```bash
# Backend logs
tail -f lz-insurance/logs/application.log

# Mobile logs
# Check Expo DevTools console
```

**Swagger Documentation:**
- User Service: http://localhost:8081/swagger-ui.html
- Notification Service: http://localhost:8086/swagger-ui.html

**Detailed Docs:**
- `docs/BACKEND_INTEGRATION.md` - Full integration guide
- `docs/SERVICES_INTEGRATION_COMPLETE.md` - Complete feature list
- `docs/ARCHITECTURE.md` - App architecture

---

## Quick Command Reference

```bash
# Start mobile app
cd "C:\Users\SHARK GAMING\reactProjects\LZ-Insurrance"
npx expo start

# Open admin panel
http://localhost:5173

# Test API endpoints
curl -X POST http://localhost:8081/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'

# Get user profile (with auth)
curl http://localhost:8081/user/get-profile \
  -H "Authorization: Bearer <token>"
```

---

**Ready to test! Start with Scenario 1 and work your way through.** 🚀
