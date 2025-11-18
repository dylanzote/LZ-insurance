import { Stack } from 'expo-router';

export default function InsuranceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="product/marketplace" />
    </Stack>
  );
}