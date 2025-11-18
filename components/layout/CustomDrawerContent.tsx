import { useAuth } from '@/contexts/AuthContext';
import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTranslation } from '@/hooks/useTranslation';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
}));

const menuSections = [
  {
    title: 'main',
    items: [
      { key: 'home', icon: '🏠', label: 'home', route: '/(tabs)' },
      { key: 'advantages', icon: '⭐', label: 'lzAdvantage', route: '/(tabs)/driving' },
    ],
  },
  {
    title: 'insurance',
    items: [
      { key: 'startClaim', icon: '🛡️', label: 'startClaim', route: '/claims/new' },
      { key: 'trackClaim', icon: '📊', label: 'trackClaim', route: '/claims/trackClaim' },
      { key: 'viewCoverage', icon: '👁️', label: 'viewCoverage', route: '/coverage' },
      { key: 'managePolicies', icon: '📄', label: 'managePolicies', route: '/policies/viewPolicies' },
      { key: 'viewBilling', icon: '💰', label: 'viewBilling', route: '/billing' },
      { key: 'getQuote', icon: '💬', label: 'getQuote', route: '/quotes' },
    ],
  },
  {
    title: 'support',
    items: [
      { key: 'faqs', icon: '❓', label: 'faqs', route: '/support/faqs' },
      { key: 'contact', icon: '📞', label: 'contact', route: '/support/contact' },
    ],
  },
  {
    title: 'account',
    items: [
      { key: 'profile', icon: '👤', label: 'myProfile', route: '/(tabs)/profile' },
      { key: 'settings', icon: '⚙️', label: 'settings', route: '/settings' },
      { key: 'feedback', icon: '💬', label: 'giveFeedback', route: '/feedback' },
      { key: 'privacy', icon: '🔒', label: 'privacySecurity', route: '/privacy' },
    ],
  },
];

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { top } = useSafeArea();
  const router = useRouter();

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
        <Text style={styles.headerTitle}>LZ Insurance</Text>
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

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          LZ Insurance v1.0.0
        </Text>
      </View>
    </View>
  );
}