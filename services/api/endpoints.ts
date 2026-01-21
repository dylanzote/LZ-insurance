/**
 * API Endpoints
 * 
 * This file re-exports all API modules for backward compatibility.
 * Individual APIs are organized in separate files:
 * - auth.ts - Authentication endpoints (User Service - Port 8081)
 * - user-profile.ts - User profile management (User Service - Port 8081)
 * - notifications-service.ts - Notification Service (Port 8086)
 * - policies.ts - Policy management endpoints (MOCK - TODO)
 * - claims.ts - Claims endpoints (MOCK - TODO)
 * - dashboard.ts - Dashboard data endpoints (MOCK - TODO)
 * - profile.ts - Legacy profile endpoints (MOCK - TODO)
 * - feedback.ts - Feedback endpoints (MOCK - TODO)
 * - chat.ts - Chat/messaging endpoints (MOCK - TODO)
 * - trips.ts - Driving trips endpoints (MOCK - TODO)
 * - billing.ts - Billing and payment endpoints (MOCK - TODO)
 * - quotes.ts - Insurance quotes endpoints (MOCK - TODO)
 * - notifications.ts - Legacy notification endpoints (MOCK - TODO)
 */

// Real Backend APIs
export { authAPI } from './auth';
export { notificationServiceAPI } from './notifications-service';
export { userProfileAPI } from './user-profile';

// Mock APIs (to be replaced)
export { billingAPI } from './billing';
export { chatAPI } from './chat';
export { claimsAPI } from './claims';
export { configAPI } from './config';
export { dashboardAPI } from './dashboard';
export { feedbackAPI } from './feedback';
export { notificationAPI } from './notifications';
export { policiesAPI } from './policies';
export { profileAPI } from './profile';
export { quotesAPI } from './quotes';
export { tripsAPI } from './trips';

