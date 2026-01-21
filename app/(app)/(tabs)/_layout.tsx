import { Tabs } from 'expo-router';
import { Home, Shield, User, TrendingUp} from 'lucide-react-native';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/core/theme/useTheme';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="insurance"
          options={{
            title: 'Insurance',
            tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="driving"
          options={{
            title: 'Driving Score',
            tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

