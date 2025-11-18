import { Stack } from 'expo-router';

export default function PoliciesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="viewPolicies" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}

