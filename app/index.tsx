import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/login" />; // or "/(tabs)" if you want tabs first
}
