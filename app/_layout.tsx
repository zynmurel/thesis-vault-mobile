// app/_layout.tsx (RootLayout)
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";


import ToastManager from "toastify-react-native";
const theme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: "#f5e05d", // 👈 sets input highlight & button color
    background: "#ffffff", // white background
    text: "#000000",       // black text
  },
};
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={DefaultTheme}>
        <ToastManager />
        <Stack>
          <Stack.Screen
            name="login"
            options={{
              headerStyle: { backgroundColor: "#f5e05d" },
              headerTitleStyle: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#f5e05d",
              },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
