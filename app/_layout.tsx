import CustomDrawerContent from '@/components/layout/CustomDrawerContent';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/core/theme';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import React, { type ErrorInfo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
        // Auth stack - user is not authenticated
        <Stack.Screen name="auth" />
      ) : (
        // Main app stack - user is authenticated
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
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
              <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                  headerShown: false,
                  drawerType: 'front',
                  swipeEnabled: true,
                  drawerStyle: {
                    width: 280,
                  },
                }}
              >
              <Drawer.Screen
                name="(tabs)"
                options={{
                  title: 'Home',
                }}
              />
              <Drawer.Screen
                name="claims"
                options={{
                  title: 'Claims',
                }}
              />
              <Drawer.Screen
                name="policies"
                options={{
                  title: 'Policies',
                }}
              />
              <Drawer.Screen
                name="coverage"
                options={{
                  title: 'Coverage',
                }}
              />
              <Drawer.Screen
                name="billing"
                options={{
                  title: 'Billing',
                }}
              />
              <Drawer.Screen
                name="quotes"
                options={{
                  title: 'Get a Quote',
                }}
              />
              <Drawer.Screen
                name="support"
                options={{
                  title: 'Support',
                }}
              />
              <Drawer.Screen
                name="feedback"
                options={{
                  title: 'Feedback',
                }}
              />
              <Drawer.Screen
                name="privacy"
                options={{
                  title: 'Privacy & Security',
                }}
              />
              <Drawer.Screen
                name="settings"
                options={{
                  title: 'Settings',
                }}
              />
              </Drawer>
            </AuthProvider>
          </ErrorBoundary>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}