# Design Consistency & Cross-Platform Testing Guide

## Overview
This document outlines the design system standards and cross-platform testing checklist for the LZ Insurance app.

## Design System Standards

### Colors
All colors should use the theme system. No hardcoded hex colors are allowed.

**Theme Colors:**
- Primary: `theme.colors.primary`
- Success: `theme.colors.success`
- Error: `theme.colors.error`
- Warning: `theme.colors.warning`
- Info: `theme.colors.info`
- Text: `theme.colors.text`, `theme.colors.textSecondary`
- Background: `theme.colors.background`, `theme.colors.card`, `theme.colors.surface`

**Action Colors:**
Use `getActionColor()` and `getActionGradient()` from `@/core/theme/colors` for:
- Policy types (auto, home, life, health)
- Quick actions (claim, coverage, document, billing, driving)
- Support actions (contact, faq, chat)

**Status Colors:**
Use `getStatusColor()` from `@/core/theme/colors` for:
- Policy status (active, expired, pending, cancelled)
- Claim status (submitted, in-review, approved, rejected)
- Payment status (paid, pending, overdue)

### Spacing
Use theme spacing tokens:
- `theme.spacing.xs` (4px)
- `theme.spacing.sm` (8px)
- `theme.spacing.md` (16px)
- `theme.spacing.lg` (24px)
- `theme.spacing.xl` (32px)

### Border Radius
Use theme radius tokens:
- `theme.radii.sm` (4px)
- `theme.radii.md` (8px)
- `theme.radii.lg` (12px)

### Shadows
All shadows should use `theme.colors.gray900` for shadowColor:
```typescript
shadowColor: theme.colors.gray900,
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 2, // Android
```

## Cross-Platform Testing Checklist

### iOS Testing
- [ ] All screens render correctly on iPhone (various sizes)
- [ ] Safe area insets are respected (notch, status bar)
- [ ] Navigation gestures work (swipe back, drawer)
- [ ] Keyboard behavior is correct (adjusts view properly)
- [ ] Status bar style matches theme (light/dark)
- [ ] Touch targets are at least 44x44 points
- [ ] Text is readable and not clipped
- [ ] Cards and modals have proper corner radius
- [ ] Shadows render correctly
- [ ] Icons are properly sized and aligned

### Android Testing
- [ ] All screens render correctly on Android (various sizes)
- [ ] Status bar and navigation bar are handled
- [ ] Back button navigation works
- [ ] Keyboard behavior is correct
- [ ] Elevation shadows render correctly
- [ ] Touch targets are at least 48x48 dp
- [ ] Text is readable and not clipped
- [ ] Cards and modals have proper corner radius
- [ ] Material Design guidelines are followed
- [ ] Edge-to-edge display is handled

### Common Issues to Check

#### Layout Issues
- [ ] No horizontal scrolling on any screen
- [ ] Content doesn't overflow containers
- [ ] Lists scroll smoothly
- [ ] Images maintain aspect ratio
- [ ] Forms are accessible (keyboard doesn't cover inputs)

#### Color & Theme
- [ ] All colors use theme (no hardcoded values)
- [ ] Dark mode works correctly
- [ ] Status colors are consistent
- [ ] Text contrast meets accessibility standards (WCAG AA)

#### Typography
- [ ] Font sizes are consistent
- [ ] Line heights are appropriate
- [ ] Text truncation works correctly
- [ ] Multiline text wraps properly

#### Components
- [ ] Buttons have proper touch feedback
- [ ] Cards have consistent padding
- [ ] Inputs have proper focus states
- [ ] Loading states are visible
- [ ] Error states are clear
- [ ] Empty states are informative

#### Navigation
- [ ] Drawer opens/closes smoothly
- [ ] Tab navigation works
- [ ] Deep linking works
- [ ] Back navigation is consistent

#### Performance
- [ ] Screens load quickly
- [ ] Lists scroll smoothly (no jank)
- [ ] Images load progressively
- [ ] Animations are smooth (60fps)

## Screen-by-Screen Checklist

### Dashboard
- [ ] Stats cards display correctly
- [ ] Quick actions are accessible
- [ ] Policy cards show all information
- [ ] Recent activity list scrolls
- [ ] Driving score card (if enabled) displays
- [ ] Pull-to-refresh works

### Policies
- [ ] Policy list displays correctly
- [ ] Policy cards are consistent
- [ ] Policy detail screen shows all info
- [ ] Renewal banner displays correctly
- [ ] Status badges use correct colors

### Claims
- [ ] Claims list displays correctly
- [ ] Claim cards show status colors
- [ ] New claim form is accessible
- [ ] File upload works
- [ ] Claim detail screen shows all info

### Billing
- [ ] Invoice list displays correctly
- [ ] Payment methods are shown
- [ ] Currency formatting is correct
- [ ] Payment flow works

### Quotes
- [ ] Quote form is accessible
- [ ] Date picker works on both platforms
- [ ] Quote list displays correctly
- [ ] Quote detail shows all info

### Profile
- [ ] Profile information displays
- [ ] Settings are accessible
- [ ] Two-factor auth works
- [ ] Language switcher works

### Driving Score (if enabled)
- [ ] Score displays correctly
- [ ] Trip history loads
- [ ] Map displays (if available)
- [ ] Trip details show correctly

### Chat (if enabled)
- [ ] Messages display correctly
- [ ] Input is accessible
- [ ] Keyboard doesn't cover input
- [ ] Message bubbles are styled correctly

### Feedback (if enabled)
- [ ] Form is accessible
- [ ] Rating component works
- [ ] Submission works

## Testing Commands

### iOS
```bash
npm run ios
# Or
expo run:ios
```

### Android
```bash
npm run android
# Or
expo run:android
```

## Known Platform Differences

### Keyboard Handling
- iOS: Use `behavior="padding"` in KeyboardAvoidingView
- Android: Use `behavior="padding"` or `keyboardVerticalOffset`

### Shadows
- iOS: Uses `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
- Android: Uses `elevation` (also include shadow properties for consistency)

### Status Bar
- iOS: Handled by `expo-status-bar` with `style="auto"`
- Android: Handled by system UI

### Safe Area
- Use `useSafeAreaInsets()` hook for consistent safe area handling
- Always respect safe area insets for top and bottom

## Reporting Issues

When reporting design or platform-specific issues, include:
1. Platform (iOS/Android)
2. Device model and OS version
3. Screen name
4. Screenshot or description
5. Steps to reproduce
6. Expected vs actual behavior

