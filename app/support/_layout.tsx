import { Stack } from 'expo-router';

export default function SupportLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="faqs" />
      <Stack.Screen name="contact" />
    </Stack>
  );
}

