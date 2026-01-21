import CustomDrawerContent from '@/components/layout/CustomDrawerContent';
import { EmailVerificationBanner } from '@/components/shared/EmailVerificationBanner';
import { useAuthStore } from '@/core/store/useAuthStore';
import { Drawer } from 'expo-router/drawer';
import React from 'react';

export default function AppLayout() {
  const { user } = useAuthStore();

  return (
    <>
      {/* Show blocking modal if email is not verified */}
      {user && !user.emailConfirmed && (
        <EmailVerificationBanner blocking={true} />
      )}
      
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
    </>
  );
}
