import { createThemedStyles } from '@/core/theme/createThemedStyles';
import { useTheme } from '@/core/theme/useTheme';
import { useNotifications } from '@/features/notifications';
import { useSafeArea } from '@/hooks/useSafeArea';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Bell, Menu } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
}

const useStyles = createThemedStyles((theme) => ({
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as const,
  leftSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  menuButton: {
    padding: 8,
    marginRight: 8,
  } as const,
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text,
    flexShrink: 1,
    flexWrap: 'wrap' as const,
  } as const,
  notificationButton: {
    position: 'relative' as const,
    padding: 8,
  } as const,
  badge: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  badgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '600' as const,
  } as const,
}));

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  showNotifications = true 
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { unreadCount } = useNotifications();
  const { top } = useSafeArea();

  const handleDrawerToggle = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
  };

  return (
    <View 
      style={[styles.header, { paddingTop: top + 12 }]}
      accessibilityRole="header"
    >
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleDrawerToggle}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          accessibilityHint="Tap to open navigation menu"
        >
          <Menu color={theme.colors.text} size={24} />
        </TouchableOpacity>
        
        {title && (
          <Text 
            style={styles.title}
            accessibilityRole="header"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {title}
          </Text>
        )}
      </View>
      
      {showNotifications && (
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotificationsPress}
          accessibilityRole="button"
          accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          accessibilityHint="Tap to view notifications"
        >
          <Bell color={theme.colors.text} size={24} />
          {unreadCount > 0 && (
            <View 
              style={styles.badge}
              accessibilityRole="text"
              accessibilityLabel={`${unreadCount} unread notifications`}
            >
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};