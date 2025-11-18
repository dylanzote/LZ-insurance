# LZ-Insurance Project Architecture

## Overview
This is a React Native/Expo application built with TypeScript, using Expo Router for file-based routing, following a feature-based architecture pattern.

## Technology Stack

### Core Technologies
- **React Native**: 0.81.5
- **Expo**: ~54.0.23
- **Expo Router**: ~6.0.14 (file-based routing)
- **TypeScript**: 5.9.2
- **React**: 19.1.0

### Key Libraries
- **State Management**: Zustand (with AsyncStorage persistence)
- **Form Management**: React Hook Form + Zod validation
- **HTTP Client**: Axios (with interceptors, retry logic)
- **Internationalization**: i18n-js (English/French)
- **Navigation**: @react-navigation (Drawer, Tabs, Stack)
- **Icons**: lucide-react-native
- **Location**: expo-location, expo-task-manager
- **Image/Document Picker**: expo-image-picker, expo-document-picker

## Project Structure

```
LZ-Insurrance/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx        # Root layout with providers
│   ├── (tabs)/            # Tab navigation group
│   ├── auth/              # Authentication routes
│   ├── claims/            # Claims feature routes
│   ├── policies/          # Policies feature routes
│   └── [feature]/         # Other feature routes
├── features/              # Feature modules (business logic)
│   └── [feature]/
│       ├── components/     # Feature-specific components
│       ├── hooks/         # Feature-specific hooks
│       ├── screens/       # Screen components
│       ├── types/         # Feature-specific types
│       └── index.ts       # Public exports
├── components/            # Shared/reusable components
│   ├── auth/             # Auth-related components
│   ├── layout/           # Layout components (Header, Drawer)
│   ├── location/         # Location-related components
│   ├── shared/           # Shared utilities (ErrorBoundary, Loading, EmptyState)
│   └── ui/               # UI primitives (Button, Card, Text, Badge, FormInput)
├── core/                 # Core application logic
│   ├── constants/        # App constants (routes, config, storage keys)
│   ├── i18n/             # Translation files (en.json, fr.json)
│   ├── store/            # Global state (Zustand stores)
│   ├── theme/            # Theming system
│   ├── types/            # Core TypeScript types
│   └── utils/            # Utility functions (validation, storage, error helpers)
├── services/             # External service integrations
│   ├── api/              # API client, endpoints, interceptors
│   └── location/         # Location tracking service
├── contexts/             # React Context providers
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
└── hooks/                # Shared custom hooks
    ├── useTranslation.ts
    ├── useTheme.ts
    ├── useSafeArea.ts
    ├── useFormValidation.ts
    └── useErrorHandler.ts
```

## Architecture Patterns

### 1. Feature-Based Architecture
Each feature is self-contained in the `features/` directory with its own:
- **Components**: Feature-specific UI components
- **Hooks**: Custom hooks for data fetching and business logic
- **Screens**: Full screen components
- **Types**: TypeScript interfaces/types
- **index.ts**: Public API exports

**Example Structure:**
```
features/claims/
├── components/
│   └── ClaimCard.tsx
├── hooks/
│   └── useClaims.ts
├── screens/
│   ├── ClaimsListScreen.tsx
│   ├── ClaimDetailScreen.tsx
│   └── NewClaimScreen.tsx
├── types/
│   └── index.ts
└── index.ts
```

### 2. File-Based Routing (Expo Router)
Routes are defined by the file structure in the `app/` directory:
- `app/index.tsx` → Root route
- `app/(tabs)/index.tsx` → Home tab
- `app/(tabs)/_layout.tsx` → Tab navigator layout
- `app/claims/_layout.tsx` → Claims stack layout
- `app/claims/new.tsx` → New claim route
- `app/claims/[id].tsx` → Dynamic claim detail route
- `app/policies/viewPolicies.tsx` → Policies list route
- `app/policies/[id].tsx` → Dynamic policy detail route

**Route Patterns:**
- `(tabs)` - Tab navigation group
- `[id]` - Dynamic route parameter
- `_layout.tsx` - Layout wrapper for nested routes

### 3. Component Organization

#### UI Components (`components/ui/`)
Primitive, reusable components:
- `Text.tsx` - Typography component with variants (h1-h4, body, caption, label)
- `Button.tsx` - Button with variants, sizes, loading states
- `Card.tsx` - Card container with variants (default, elevated, outlined)
- `Badge.tsx` - Badge component with variants (success, warning, error, info)
- `FormInput.tsx` - Form input with validation, error display
- `Input.tsx` - Basic input component

#### Layout Components (`components/layout/`)
- `Header.tsx` - App header with drawer toggle, notifications, title
- `CustomDrawerContent.tsx` - Custom drawer navigation menu

#### Shared Components (`components/shared/`)
- `ErrorBoundary.tsx` - Error boundary with fallback UI
- `LoadingSpinner.tsx` - Loading indicator
- `EmptyState.tsx` - Empty state display

### 4. Styling System

#### Themed Styles
Use `createThemedStyles` for theme-aware styles:

```typescript
import { createThemedStyles } from '@/core/theme/createThemedStyles';

const useStyles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
}));

// In component
const styles = useStyles();
```

#### Theme Structure
- `theme.colors` - Color palette (primary, secondary, text, background, etc.)
- `theme.spacing` - Spacing scale (xs, sm, md, lg, xl)
- `theme.radii` - Border radius values
- `theme.typography` - Typography scale

### 5. State Management

#### Global State (Zustand)
- `core/store/useAuthStore.ts` - Authentication state with AsyncStorage persistence

#### Context Providers
- `AuthContext` - Authentication state and methods
- `LanguageContext` - Language/locale state
- `ThemeProvider` - Theme state (light/dark/system)

#### Local State
- React hooks (`useState`, `useReducer`) for component-local state
- Custom hooks for feature-specific state logic

### 6. API Layer

#### API Client (`services/api/client.ts`)
- Axios instance with base URL, timeout, retry logic
- Request/response interceptors for auth tokens, error handling

#### API Endpoints (`services/api/endpoints.ts`)
- Organized by feature (dashboardAPI, claimsAPI, policiesAPI, tripsAPI)
- Mock data for development
- Type-safe API responses

#### Interceptors (`services/api/interceptors.ts`)
- Request: Add auth tokens, debug logging
- Response: Error handling (401, 403, 404, 422, 429, 5xx), auto-logout on 401

### 7. Internationalization (i18n)

#### Translation Files
- `core/i18n/en.json` - English translations
- `core/i18n/fr.json` - French translations

#### Usage
```typescript
import { useTranslation } from '@/hooks/useTranslation';

const { t, locale } = useTranslation();
const message = t('dashboard.title'); // "Dashboard"
const interpolated = t('dashboard.discountEligible', { discount: 15 }); // "You're eligible for a 15% discount"
```

#### Translation Key Structure
- Nested objects: `dashboard.title`, `auth.login`, `policies.coverage`
- Interpolation: Use `%{variable}` in JSON, pass `{ variable: value }` to `t()`
- Pluralization: Use `i18n.t()` with `count` parameter

### 8. Type Safety

#### Core Types (`core/types/`)
- `index.ts` - Core domain types (User, Policy, Claim, etc.)
- `api.ts` - API-specific types (AuthTokens, ApiResponse, ApiError)
- `navigation.ts` - Navigation type definitions

#### Feature Types
Each feature defines its own types in `features/[feature]/types/index.ts`

### 9. Form Validation

#### Validation Schema (Zod)
- `core/utils/validation.ts` - Zod schemas with translated error messages
- Uses `i18n.t()` directly for validation messages

#### Form Hook
- `hooks/useFormValidation.ts` - Wrapper around react-hook-form with Zod resolver
- Provides `register`, `handleSubmit`, `errors`, `watch`, `getValues`

### 10. Navigation Patterns

#### Route Structure
- **Feature routes**: `app/[feature]/` (e.g., `app/claims/`, `app/policies/`)
- **Feature layouts**: `app/[feature]/_layout.tsx` (Stack navigator)
- **List screens**: `app/[feature]/view[Feature].tsx` or `app/[feature]/track[Feature].tsx`
- **Detail screens**: `app/[feature]/[id].tsx` (dynamic route)
- **New/create screens**: `app/[feature]/new.tsx`

#### Navigation Examples
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/claims/trackClaim');
router.push(`/policies/${policyId}`);
router.push({ pathname: '/policies/viewPolicies', params: { type: 'auto' } });
```

### 11. Custom Hooks Pattern

#### Feature Hooks
- `use[Feature]` - Data fetching hook (e.g., `useClaims`, `usePolicies`, `useDashboard`)
- Returns: `{ data, loading, error, refetch }`

#### Shared Hooks
- `useTranslation()` - Translation hook
- `useTheme()` - Theme hook
- `useSafeArea()` - Safe area insets
- `useFormValidation()` - Form validation hook
- `useErrorHandler()` - Error handling hook

### 12. Error Handling

#### Error Boundary
- `components/shared/ErrorBoundary.tsx` - Catches React errors, displays fallback UI
- Wraps entire app in `app/_layout.tsx`

#### API Error Handling
- Centralized in `services/api/interceptors.ts`
- Transforms API errors to `ApiError` type
- Auto-logout on 401 errors

### 13. Accessibility

#### Best Practices
- Use `accessibilityLabel`, `accessibilityHint`, `accessibilityRole`
- Screen reader support
- Proper semantic HTML equivalents

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `PolicyCard.tsx`, `ClaimsListScreen.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useClaims.ts`, `useDashboard.ts`)
- **Types**: PascalCase (e.g., `Policy`, `Claim`, `DashboardStats`)
- **Utils**: camelCase (e.g., `validation.ts`, `errorHelpers.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEYS`, `APP_CONFIG`)

### Routes
- **Feature folders**: lowercase (e.g., `claims/`, `policies/`)
- **List screens**: `view[Feature].tsx` or `track[Feature].tsx`
- **Detail screens**: `[id].tsx`
- **New/create**: `new.tsx`
- **Layouts**: `_layout.tsx`

### Components
- **Screen components**: `[Feature]Screen.tsx` (e.g., `DashboardScreen.tsx`)
- **Feature components**: `[Feature][Component].tsx` (e.g., `PolicyCard.tsx`)
- **UI components**: Generic names (e.g., `Button.tsx`, `Card.tsx`)

## Best Practices

### 1. Feature Isolation
- Each feature should be self-contained
- Export only public API through `index.ts`
- Avoid cross-feature dependencies

### 2. Type Safety
- Always define TypeScript types for props, state, API responses
- Use type inference where possible
- Avoid `any` types (use `as any` only for route navigation when necessary)

### 3. Component Composition
- Prefer composition over inheritance
- Use `React.memo` for expensive components
- Extract reusable logic into custom hooks

### 4. Styling
- Use `createThemedStyles` for all styles
- Access theme through `useTheme()` hook
- Use theme tokens (colors, spacing, radii) instead of hardcoded values

### 5. Translations
- All user-facing text must be translated
- Use translation keys, never hardcode strings
- Test with both English and French

### 6. Error Handling
- Always handle loading and error states
- Use `ErrorBoundary` for React errors
- Provide user-friendly error messages

### 7. Performance
- Use `React.memo` for list items
- Memoize expensive computations with `useMemo`
- Lazy load screens where appropriate

### 8. Code Organization
- Keep files focused and single-purpose
- Group related functionality together
- Use barrel exports (`index.ts`) for clean imports

## Common Patterns

### Screen Component Pattern
```typescript
import { Header } from '@/components/layout/Header';
import { useTranslation } from '@/hooks/useTranslation';
import { createThemedStyles } from '@/core/theme/createThemedStyles';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export const FeatureScreen: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Header title={t('feature.title')} showNotifications={true} />
      {/* Screen content */}
    </View>
  );
};
```

### Data Fetching Hook Pattern
```typescript
export const useFeature = () => {
  const [data, setData] = useState<FeatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await featureAPI.getData();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
};
```

### Form Pattern
```typescript
import { useFormValidation } from '@/hooks/useFormValidation';
import { claimFormSchema } from '@/core/utils/validation';

export const NewClaimScreen: React.FC = () => {
  const { register, handleSubmit, errors, watch } = useFormValidation(claimFormSchema);
  
  const onSubmit = async (data: ClaimFormData) => {
    // Handle form submission
  };
  
  return (
    <FormInput
      {...register('title')}
      error={errors.title}
      placeholder={t('claims.step2.titlePlaceholder')}
    />
  );
};
```

## Important Notes

1. **Route Navigation**: Use `expo-router`'s `useRouter()` hook. For dynamic routes, cast to `any` if TypeScript complains: `router.push('/route' as any)`

2. **Safe Area**: Always use `useSafeArea()` hook for iOS/Android safe area handling, especially in headers and drawer content

3. **Translation Keys**: Avoid duplicate keys in translation files. If you need nested objects, use distinct names (e.g., `coverage` for string, `coverageTypes` for object)

4. **Text Rendering**: Always ensure Text component children are strings. Use `String()` conversion if needed to prevent "Objects are not valid as a React child" errors

5. **Feature Routes**: Follow the pattern `app/[feature]/` for feature-specific routes. Each feature should have its own `_layout.tsx` if it has multiple screens

6. **Drawer Navigation**: Update `CustomDrawerContent.tsx` and `app/_layout.tsx` when adding new drawer routes

7. **Type Exports**: Always export types from feature `index.ts` files for clean imports

