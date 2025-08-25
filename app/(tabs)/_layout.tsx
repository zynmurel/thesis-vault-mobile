import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useUserStore } from "@/hooks/user";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const { setUserId } = useUserStore();
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_id");
    router.replace("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user_id = await AsyncStorage.getItem("user_id");
        if (user_id) {
          setUserId(user_id);
        } else {
          handleLogout();
        }
      } catch (e) {
        console.error("Failed to fetch user_id", e);
      }
    };

    fetchUser();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: true, // Show the header if it's hidden
          headerStyle: {
            height: 45, // 👈 Adjusts header height
            elevation: 0, // ✅ Removes shadow on Android
            shadowOpacity: 0, // Optional: fallback for iOS
            borderBottomWidth: 0, // Optional: fallback for iOS
            backgroundColor: "#f5e05d", // Header background color
          },
          headerTitleStyle: {
            fontSize: 20, // 👈 Adjusts text size
            fontWeight: "bold", // optional,
            color: "#f5e05d",
          },
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="borrow"
        options={{
          title: "Theses",
          headerShown: true, // Show the header if it's hidden
          headerStyle: {
            height: 45, // 👈 Adjusts header height
            elevation: 0, // ✅ Removes shadow on Android
            shadowOpacity: 0, // Optional: fallback for iOS
            borderBottomWidth: 0, // Optional: fallback for iOS
            backgroundColor: "#f5e05d", // Header background color
          },
          headerTitleStyle: {
            fontSize: 20, // 👈 Adjusts text size
            fontWeight: "bold", // optional,
            color: "#f5e05d",
          },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="book-open-variant"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notification",
          headerShown: true, // Show the header if it's hidden
          headerStyle: {
            height: 45, // 👈 Adjusts header height
            elevation: 0, // ✅ Removes shadow on Android
            shadowOpacity: 0, // Optional: fallback for iOS
            borderBottomWidth: 0, // Optional: fallback for iOS
            backgroundColor: "#f5e05d", // Header background color
          },
          headerTitleStyle: {
            fontSize: 20, // 👈 Adjusts text size
            fontWeight: "bold", // optional,
            color: "#f5e05d",
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user-circle" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
