import { Stack } from 'expo-router';

export default function ClaimsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="new" />
      <Stack.Screen name="trackClaim" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}

