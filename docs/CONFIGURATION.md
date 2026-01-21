# Configuration System

## Overview

The application now includes a comprehensive configuration system that allows for dynamic customization without requiring code deployments. Most app settings can be changed via API calls or configuration files.

## Architecture

### Configuration Store (`core/config/store.ts`)
- Zustand-based state management
- Persistent storage using AsyncStorage
- Automatic loading and caching
- Version-based cache invalidation

### Configuration Types (`core/config/types.ts`)
Defines all configurable aspects:
- **Currency**: Code, symbol, position, decimal places, separators
- **Localization**: Default locale, supported locales, date/time formats
- **Branding**: App name, company info, colors, logos
- **Features**: Feature flags for enabling/disabling functionality
- **Business Rules**: Policy amounts, deadlines, grace periods
- **UI Settings**: Pagination, file upload limits, formats
- **Notifications**: Channels and preferences

### Default Configuration (`core/config/defaultConfig.ts`)
Fallback values used when API config is unavailable or during initial load.

## Usage

### Accessing Configuration

```typescript
import { useAppConfig } from '@/core/config/hooks';
import { useCurrencyConfig } from '@/core/config/store';

// Get full config
const config = useAppConfig();

// Get specific section
const currency = useCurrencyConfig();
```

### Formatting Functions

Use the formatting hooks for consistent currency, date, and number formatting:

```typescript
import { useFormatting } from '@/hooks/useFormatting';

function MyComponent() {
  const { formatCurrency, formatDate, formatNumber } = useFormatting();
  
  return (
    <Text>{formatCurrency(1234.56)}</Text>
    <Text>{formatDate(new Date(), { format: 'short' })}</Text>
    <Text>{formatNumber(1000)}</Text>
  );
}
```

### API Configuration Endpoints

```typescript
import { configAPI } from '@/services/api/endpoints';

// Get current configuration
const response = await configAPI.getConfig();

// Update configuration (admin only)
await configAPI.updateConfig({
  currency: {
    code: 'USD',
    symbol: '$',
    // ...
  }
});

// Update specific section
await configAPI.updateConfigSection('currency', {
  code: 'EUR',
  symbol: '€',
  position: 'after',
  // ...
});
```

## Configuration Sections

### Currency Configuration
```typescript
currency: {
  code: 'CAD',           // ISO 4217 currency code
  symbol: '$',           // Currency symbol
  position: 'before',    // 'before' | 'after'
  decimalPlaces: 2,      // Number of decimal places
  thousandsSeparator: ',',
  decimalSeparator: '.',
}
```

### Localization
```typescript
locale: {
  default: 'en',
  supported: ['en', 'fr'],
  dateFormat: 'MMM dd, yyyy',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'MMM dd, yyyy HH:mm',
}
```

### Feature Flags
```typescript
features: {
  biometricAuth: true,
  pushNotifications: true,
  chatSupport: true,
  drivingScore: true,
  marketplace: true,
  feedback: true,
  twoStepVerification: true,
}
```

### Business Rules
```typescript
business: {
  minPolicyAmount: 100,
  maxPolicyAmount: 10000000,
  defaultDeductible: 500,
  claimSubmissionDeadline: 30,  // Days
  paymentGracePeriod: 15,        // Days
  tripReviewDeadline: 7,         // Days
  quoteExpirationDays: 30,
}
```

## Migration Guide

### Replacing Hardcoded Currency

**Before:**
```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
};
```

**After:**
```typescript
import { useFormatting } from '@/hooks/useFormatting';

function MyComponent() {
  const { formatCurrency } = useFormatting();
  // Use formatCurrency(amount) directly
}
```

### Replacing Hardcoded Dates

**Before:**
```typescript
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
```

**After:**
```typescript
import { useFormatting } from '@/hooks/useFormatting';

function MyComponent() {
  const { formatDate } = useFormatting();
  // Use formatDate(date, { format: 'long' })
}
```

## Best Practices

1. **Always use formatting hooks** instead of hardcoded formatters
2. **Check feature flags** before rendering feature-specific UI
3. **Use config values** for business rules instead of hardcoded constants
4. **Handle config loading states** gracefully (app uses defaults during load)
5. **Version your config** - the system supports version-based cache invalidation

## Admin Configuration Management

For production, create an admin interface that allows:
- Updating currency settings
- Modifying business rules
- Toggling feature flags
- Changing branding information
- Adjusting UI settings

All changes are immediately reflected in the app after the next config fetch (or app restart).

## Environment Variables

Some configuration can still be set via environment variables for deployment-specific settings:
- `EXPO_PUBLIC_API_URL` - API base URL
- Other deployment-specific settings

## Future Enhancements

- Real-time config updates via WebSocket
- A/B testing configuration
- User-specific configuration overrides
- Configuration change history/audit log

