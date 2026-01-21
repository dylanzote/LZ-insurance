import { useAuth } from '@/contexts/AuthContext';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTranslation } from '@/hooks/useTranslation';
import { useFeatureFlags, useBrandingConfig } from '@/core/config/store';
import { APP_CONFIG } from '@/core/constants/app';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LogOut } from 'lucide-react-native';

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as const,
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.primary,
  } as const,
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.white,
    marginBottom: 4,
  } as const,
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.white + 'CC',
  } as const,
  menuSection: {
    marginTop: 20,
  } as const,
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.textSecondary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    textTransform: 'uppercase' as const,
  } as const,
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  } as const,
  menuItemActive: {
    backgroundColor: theme.colors.primary + '15',
    borderLeftColor: theme.colors.primary,
  } as const,
  menuItemText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  } as const,
  menuItemTextActive: {
    color: theme.colors.primary,
    fontWeight: '600' as const,
  } as const,
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 'auto',
  } as const,
  footerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  } as const,
  logoutButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.error + '15',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  } as const,
  logoutButtonText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '600' as const,
    marginLeft: 12,
  } as const,
}));

// Menu sections will be filtered based on feature flags in the component
const baseMenuSections = [
  {
    title: 'main',
    items: [
      { key: 'home', icon: '🏠', label: 'home', route: '/(app)/(tabs)', feature: null as const },
      { key: 'advantages', icon: '⭐', label: 'lzAdvantage', route: '/(app)/(tabs)/driving', feature: 'drivingScore' as const },
    ],
  },
  {
    title: 'insurance',
    items: [
      { key: 'startClaim', icon: '🛡️', label: 'startClaim', route: '/(app)/claims/new', feature: null as const },
      { key: 'trackClaim', icon: '📊', label: 'trackClaim', route: '/(app)/claims/trackClaim', feature: null as const },
      { key: 'viewCoverage', icon: '👁️', label: 'viewCoverage', route: '/(app)/coverage', feature: null as const },
      { key: 'managePolicies', icon: '📄', label: 'managePolicies', route: '/(app)/policies/viewPolicies', feature: null as const },
      { key: 'viewBilling', icon: '💰', label: 'viewBilling', route: '/(app)/billing', feature: null as const },
      { key: 'getQuote', icon: '💬', label: 'getQuote', route: '/(app)/quotes', feature: null as const },
    ],
  },
  {
    title: 'support',
    items: [
      { key: 'faqs', icon: '❓', label: 'faqs', route: '/(app)/support/faqs', feature: null as const },
      { key: 'contact', icon: '📞', label: 'contact', route: '/(app)/support/contact', feature: null as const },
      { key: 'chat', icon: '💬', label: 'chat', route: '/(app)/chat', feature: 'chatSupport' as const },
    ],
  },
  {
    title: 'account',
    items: [
      { key: 'profile', icon: '👤', label: 'myProfile', route: '/(app)/(tabs)/profile', feature: null as const },
      { key: 'settings', icon: '⚙️', label: 'settings', route: '/(app)/settings', feature: null as const },
      { key: 'feedback', icon: '💬', label: 'giveFeedback', route: '/(app)/feedback', feature: 'feedback' as const },
      { key: 'privacy', icon: '🔒', label: 'privacySecurity', route: '/(app)/privacy', feature: null as const },
    ],
  },
];

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { top } = useSafeArea();
  const router = useRouter();
  const features = useFeatureFlags();
  const branding = useBrandingConfig();

  // Filter menu sections based on feature flags
  const menuSections = baseMenuSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (!item.feature) return true;
      return features[item.feature];
    }),
  })).filter(section => section.items.length > 0);

  const currentRoute = props.state.routes[props.state.index]?.name;
  
  // Helper function to check if a route is active
  const isRouteActive = (route: string, key: string) => {
    // Check if current route matches
    if (currentRoute === key) return true;
    
    // Special handling for specific routes
    if (key === 'home' && (currentRoute === '(tabs)' || currentRoute === 'index')) {
      return true;
    }
    if (key === 'advantages' && currentRoute === 'driving') {
      return true;
    }
    if (key === 'trackClaim' && (currentRoute === 'trackClaim' || currentRoute?.includes('trackClaim'))) {
      return true;
    }
    if (key === 'viewCoverage' && currentRoute === 'coverage') {
      return true;
    }
    if (key === 'managePolicies' && (currentRoute === 'viewPolicies' || currentRoute === 'policies' || currentRoute?.includes('policies'))) {
      return true;
    }
    if (key === 'profile' && currentRoute === 'profile') {
      return true;
    }
    
    // Check if route path matches
    const routePath = route.replace(/^\/+/, '').replace(/\/+/g, '/');
    const currentPath = currentRoute?.replace(/^\/+/, '').replace(/\/+/g, '/');
    
    return routePath === currentPath || currentPath?.startsWith(routePath + '/');
  };

  return (
    <View style={styles.container}>
      {/* Header with safe area padding */}
      <View style={[styles.header, { paddingTop: top + 20 }]}>
        <Text style={styles.headerTitle}>{branding.appName}</Text>
        <Text style={styles.headerSubtitle}>
          {t('drawer.welcome')}, {user?.firstName}!
        </Text>
      </View>

      <ScrollView>
        {/* Menu Sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>
              {t(`drawer.sections.${section.title}`)}
            </Text>
            {section.items.map((item) => {
              const isActive = isRouteActive(item.route, item.key);
              
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.menuItem,
                    isActive && styles.menuItemActive,
                  ]}
                  onPress={() => {
                    // Close drawer first
                    props.navigation.closeDrawer();
                    
                    // Navigate using expo-router
                    setTimeout(() => {
                      if (item.key === 'home') {
                        // Navigate to home (tabs index which shows DashboardScreen)
                        router.push('/(tabs)' as any);
                      } else if (item.key === 'advantages') {
                        // Navigate to driving score screen (LZ Advantage)
                        router.push('/(tabs)/driving' as any);
                      } else {
                        // Navigate to the specified route
                        router.push(item.route as any);
                      }
                    }, 100);
                  }}
                >
                  <Text>{item.icon}</Text>
                  <Text style={[
                    styles.menuItemText,
                    isActive && styles.menuItemTextActive,
                  ]}>
                    {t(`drawer.items.${item.label}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              t('auth.confirmLogout'),
              t('auth.confirmLogoutMessage'),
              [
                {
                  text: t('common.cancel'),
                  style: 'cancel',
                },
                {
                  text: t('auth.logout'),
                  style: 'destructive',
                  onPress: () => {
                    props.navigation.closeDrawer();
                    logout();
                    router.replace('/auth/login');
                  },
                },
              ]
            );
          }}
        >
          <LogOut size={20} color={styles.logoutButtonText.color} />
          <Text style={styles.logoutButtonText}>
            {t('auth.logout')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          {branding.appName} {APP_CONFIG.version}
        </Text>
      </View>
    </View>
  );
}