# Push Notifications Setup Guide

## Production Setup

### 1. Expo Project ID

Add your Expo project ID to `.env` or `app.json`:

```env
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
```

To get your project ID:
```bash
npx expo whoami
npx expo projects:list
```

Or create a new project:
```bash
npx expo projects:create
```

### 2. Backend Integration

The notification service is ready for backend integration. Update the following in `services/api/endpoints.ts`:

- `notificationAPI.registerToken()` - Register push tokens with your backend
- `notificationAPI.unregisterToken()` - Remove tokens when users log out
- `notificationAPI.send()` - Send push notifications via your backend

### 3. Sending Push Notifications

#### Using Expo Push Notification Service (EPNS)

```typescript
import { notificationAPI } from '@/services/api/endpoints';

// Send notification to a specific user
await notificationAPI.send({
  title: 'Claim Approved',
  body: 'Your claim has been approved',
  data: {
    type: 'claim_approved',
    deepLink: '/claims/CL-2024-001',
    metadata: { claimId: 'CL-2024-001' }
  },
  userId: 'user-id'
});
```

#### Backend Implementation Example

```javascript
// Node.js/Express example
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

async function sendPushNotification(pushToken, notification) {
  const messages = [{
    to: pushToken,
    sound: 'default',
    title: notification.title,
    body: notification.body,
    data: notification.data,
    priority: 'high',
  }];

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}
```

### 4. Notification Types

All notification types are defined in `features/notifications/types/index.ts`:

- **Claims**: `claim_update`, `claim_approved`, `claim_rejected`, `claim_document_required`
- **Policies**: `policy_reminder`, `policy_expiring`, `policy_renewed`, `policy_cancelled`
- **Payments**: `payment`, `payment_due`, `payment_failed`, `payment_success`
- **Quotes**: `quote_ready`, `quote_approved`, `quote_expired`
- **System**: `system`, `security`, `two_step_verification`, `password_changed`, `profile_updated`
- **Driving**: `driving_score`, `trip_review`
- **Other**: `invoice`, `document_ready`, `feedback_response`, `promotion`

### 5. Deep Linking

Notifications automatically navigate to the correct screen based on:
1. `deepLink` property (if provided)
2. Notification `type` and `metadata` (fallback)

Example deep links:
- `/claims/CL-2024-001`
- `/policies/POL-001`
- `/quotes/QT-2024-001`
- `/billing`
- `/driving/review/TRIP-001`

### 6. Testing

#### Local Testing
```typescript
import { notificationService } from '@/services/notifications/notificationService';

// Schedule a test notification
await notificationService.scheduleLocalNotification(
  'Test Notification',
  'This is a test notification',
  {
    type: 'system',
    deepLink: '/notifications'
  }
);
```

#### Production Testing
Use Expo's push notification tool:
```bash
npx expo push:send --to <EXPO_PUSH_TOKEN>
```

### 7. Permissions

The app automatically requests notification permissions on first launch. Users can manage permissions in:
- iOS: Settings > LZ Insurance > Notifications
- Android: Settings > Apps > LZ Insurance > Notifications

### 8. Badge Count

The app automatically updates the notification badge count. To clear:
```typescript
await notificationService.clearBadge();
```

### 9. Environment Variables

Required for production:
- `EXPO_PUBLIC_PROJECT_ID` - Your Expo project ID

Optional:
- `EXPO_PUBLIC_PUSH_NOTIFICATION_ENABLED` - Enable/disable push notifications (default: true)

### 10. Production Checklist

- [ ] Add Expo project ID to environment variables
- [ ] Configure backend API endpoints for token registration
- [ ] Set up Expo Push Notification Service (EPNS) or your own push service
- [ ] Test push notifications on iOS and Android devices
- [ ] Configure notification sounds (optional)
- [ ] Set up notification analytics/tracking
- [ ] Test deep linking for all notification types
- [ ] Configure notification categories (iOS) and channels (Android)
- [ ] Set up notification scheduling for reminders
- [ ] Test notification permissions flow








