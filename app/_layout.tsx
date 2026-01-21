import { ConfigProvider } from '@/components/config/ConfigProvider';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ThemeProvider } from '@/core/theme';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { type ErrorInfo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Loading component
const useLoadingStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
  } as const,
  loadingText: {
    marginTop: 16,
    color: theme.colors.textSecondary,
  } as const,
}));

function LoadingScreen() {
  const styles = useLoadingStyles();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

// Router component that handles auth state
function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth stack - user is not authenticated, no drawer
        <Stack.Screen 
          name="auth" 
          options={{
            gestureEnabled: false,
          }}
        />
      ) : (
        // Main app stack - user is authenticated, show drawer
        <Stack.Screen 
          name="(app)" 
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ConfigProvider>
            <LanguageProvider>
              <ErrorBoundary
              onError={(error: Error, errorInfo: ErrorInfo) => {
                // Log to error reporting service (e.g., Sentry, Crashlytics)
                if (__DEV__) {
                  console.error('Root Error:', error, errorInfo);
                }
              }}
            >
              <StatusBar style="auto" />
              <AuthProvider>
                <NotificationProvider>
                  <Router />
                </NotificationProvider>
              </AuthProvider>
            </ErrorBoundary>
          </LanguageProvider>
          </ConfigProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
