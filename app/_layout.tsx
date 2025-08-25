import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import ToastManager from "toastify-react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <ToastManager />
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerStyle: {
              backgroundColor: "#f5e05d", // Header background color
            },
            headerTitleStyle: {
              fontSize: 20, // 👈 Adjusts text size
              fontWeight: "bold", // optional,
              color: "#f5e05d",
            },
            headerShadowVisible: false, // ✅ this removes the shadow
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
