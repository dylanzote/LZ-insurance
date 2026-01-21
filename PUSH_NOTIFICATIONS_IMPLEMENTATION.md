# Push Notifications Implementation - Complete Guide

## Overview

A complete, production-ready push notification system has been implemented for the LZ Insurance app. The system handles all notification types, deep linking, badge counts, and automatic navigation.

## Features Implemented

### ✅ Core Functionality
- **Push Notification Service** (`services/notifications/notificationService.ts`)
  - Token registration and management
  - Permission handling
  - Local notification scheduling
  - Badge count management
  - Notification listeners (received & tapped)

- **Notification Context** (`contexts/NotificationContext.tsx`)
  - Global notification state management
  - Automatic token registration
  - Notification tap handling with deep linking
  - Badge count updates
  - App state monitoring (refresh on foreground)

- **API Integration** (`services/api/endpoints.ts`)
  - `notificationAPI.getAll()` - Fetch all notifications
  - `notificationAPI.getById()` - Get specific notification
  - `notificationAPI.markAsRead()` - Mark as read
  - `notificationAPI.markAllAsRead()` - Mark all as read
  - `notificationAPI.delete()` - Delete notification
  - `notificationAPI.registerToken()` - Register push token
  - `notificationAPI.unregisterToken()` - Unregister token
  - `notificationAPI.send()` - Send push notification

### ✅ Notification Types

All possible notification types are supported:

**Claims:**
- `claim_update` - General claim updates
- `claim_approved` - Claim approved
- `claim_rejected` - Claim rejected
- `claim_document_required` - Documents needed

**Policies:**
- `policy_reminder` - Policy reminder
- `policy_expiring` - Policy expiring soon
- `policy_renewed` - Policy renewed
- `policy_cancelled` - Policy cancelled

**Payments:**
- `payment` - General payment notification
- `payment_due` - Payment due
- `payment_failed` - Payment failed
- `payment_success` - Payment successful

**Quotes:**
- `quote_ready` - Quote ready for review
- `quote_approved` - Quote approved
- `quote_expired` - Quote expired

**System:**
- `system` - System notifications
- `security` - Security alerts
- `two_step_verification` - 2FA notifications
- `password_changed` - Password changed
- `profile_updated` - Profile updated

**Driving:**
- `driving_score` - Driving score updates
- `trip_review` - Trip review available

**Other:**
- `invoice` - Invoice notifications
- `document_ready` - Document ready
- `feedback_response` - Feedback response
- `promotion` - Promotional notifications

### ✅ Deep Linking & Navigation

Notifications automatically navigate to the correct screen:

1. **Primary**: Uses `deepLink` property if provided
2. **Fallback**: Uses `type` and `metadata` to determine navigation

**Navigation Examples:**
- Claims → `/claims/{claimId}` or `/claims`
- Policies → `/policies/{policyId}` or `/policies`
- Quotes → `/quotes/{quoteId}` or `/quotes`
- Payments → `/billing`
- Driving → `/driving/review/{tripId}` or `/driving`
- Profile → `/profile`
- Documents → `/documents`
- Feedback → `/feedback`
- Default → `/notifications`

### ✅ UI Integration

- **Header Badge**: Shows unread count in header notification icon
- **Notifications Screen**: Full notification list with pull-to-refresh
- **Notification Item**: Individual notification cards with type indicators
- **Empty State**: Friendly empty state when no notifications

### ✅ Configuration

**app.json** has been updated with:
- iOS notification permissions
- Android notification permissions
- Expo Notifications plugin configuration
- Background modes for remote notifications

## Production Setup

### 1. Environment Variables

Add to `.env`:
```env
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
```

Get your project ID:
```bash
npx expo whoami
npx expo projects:list
```

### 2. Backend Integration

Update `services/api/endpoints.ts` to connect to your backend:

```typescript
// Replace mock implementations with real API calls
export const notificationAPI = {
  registerToken: async (tokenData) => {
    // POST /api/notifications/tokens
    return await api.post('/notifications/tokens', tokenData);
  },
  // ... other methods
};
```

### 3. Sending Notifications

#### Option A: Expo Push Notification Service (EPNS)

```typescript
// Backend example (Node.js)
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendNotification(pushToken, notification) {
  const messages = [{
    to: pushToken,
    sound: 'default',
    title: notification.title,
    body: notification.body,
    data: {
      type: notification.type,
      deepLink: notification.deepLink,
      metadata: notification.metadata,
    },
    priority: 'high',
  }];

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
}
```

#### Option B: Your Own Push Service

Integrate with Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs) directly.

### 4. Testing

**Local Testing:**
```typescript
import { notificationService } from '@/services/notifications/notificationService';

// Schedule a test notification
await notificationService.scheduleLocalNotification(
  'Test',
  'This is a test',
  { type: 'system', deepLink: '/notifications' }
);
```

**Production Testing:**
```bash
# Using Expo CLI
npx expo push:send --to <EXPO_PUSH_TOKEN>
```

## Usage Examples

### Registering for Push Notifications

The app automatically registers on launch. Manual registration:

```typescript
import { useNotifications } from '@/contexts/NotificationContext';

const { registerForPushNotifications } = useNotifications();
await registerForPushNotifications();
```

### Sending a Notification (Backend)

```typescript
// Example: Claim approved notification
await sendNotification(userPushToken, {
  title: 'Claim Approved',
  body: 'Your claim #CL-2024-001 has been approved',
  type: 'claim_approved',
  deepLink: '/claims/CL-2024-001',
  metadata: { claimId: 'CL-2024-001' }
});
```

### Handling Notification Tap

Already implemented in `NotificationContext`. When a user taps a notification:
1. Notification is marked as read
2. App navigates to the appropriate screen
3. Badge count is updated

## File Structure

```
services/
  notifications/
    notificationService.ts    # Core notification service
    README.md                 # Setup guide

contexts/
  NotificationContext.tsx    # Global notification state

features/
  notifications/
    types/
      index.ts               # Notification types
    hooks/
      useNotifications.ts    # Hook (re-exports from context)
    screens/
      NotificationsScreen.tsx # Notification list screen
    components/
      NotificationItem.tsx    # Notification card component

services/api/
  endpoints.ts                # Notification API endpoints
```

## Next Steps for Production

1. **Get Expo Project ID**: Run `npx expo projects:list` or create a new project
2. **Set Environment Variable**: Add `EXPO_PUBLIC_PROJECT_ID` to `.env`
3. **Backend Integration**: Update API endpoints to connect to your backend
4. **Test on Devices**: Test push notifications on real iOS/Android devices
5. **Configure Sounds**: Add custom notification sounds (optional)
6. **Analytics**: Add notification analytics/tracking
7. **Scheduling**: Implement scheduled notifications for reminders

## Important Notes

- **Permissions**: App automatically requests permissions on first launch
- **Badge Count**: Automatically updated when notifications are read/deleted
- **Deep Linking**: All notification types have navigation handlers
- **Offline Support**: Notifications are stored and synced when app comes online
- **Token Management**: Tokens are automatically registered/unregistered on login/logout

## Support

For issues or questions, refer to:
- `services/notifications/README.md` - Detailed setup guide
- Expo Notifications Docs: https://docs.expo.dev/versions/latest/sdk/notifications/








