import { Stack } from "expo-router";
import { AssessmentProvider } from "../context/AssessmentContext";

export default function RootLayout() {
  return (
    <AssessmentProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
    </AssessmentProvider>
  );
}