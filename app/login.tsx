import { ThemedText } from "@/components/ThemedText";
import { baseUrl } from "@/constants/consts";
import { useUserStore } from "@/hooks/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Image } from "expo-image";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import {
  Button,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
  Text,
  TextInput,
} from "react-native-paper";
import { Toast } from "toastify-react-native";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f5e05d", // custom primary (green)
    outline: "#9BA1A644", // gray border when not focused
  },
};

export default function LoginScreen() {
  const { setUserId } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      //   Toast.error("Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      const data: any = await axios.post(baseUrl + "/api/mobile/login", {
        studentId: email,
        password,
      });
      if (data.data.status === 401) {
        if (data.data.message === "user_not_found") {
          Toast.error("User not found.");
        } else {
          Toast.error("Invalid credentials.");
        }
      } else {
        if (data?.data?.user?.id) {
          Toast.success("Login success!");
          router.replace("/(tabs)/home"); // or your protected route
          setUserId(data.data.user.id as string);
          await AsyncStorage.setItem("user_id", data.data.user.id);
        } else {
          Toast.error("Server error.");
        }
      }
    } catch (e: any) {
      Toast.error("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        router.replace("/(tabs)/home"); // redirect away from login
      }
    };

    checkLogin();
  }, []);

  return (
    <PaperProvider theme={customTheme}>
      <Stack.Screen options={{ title: "Login" }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            position: "absolute",
            height: 150,
            backgroundColor: "#f5e05d",
            top: 0,
            left: 0,
            right: 0,
            borderBottomRightRadius: 90,
          }}
        ></View>
        <View style={styles.innerContainer}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={require("@/assets/images/nwssu-ccis-logo.png")}
              style={styles.reactLogo}
            />
          </View>
          <ThemedText
            type="title"
            style={{ color: "#005e36", fontSize: 15, fontWeight: "800" }}
          >
            THESIS VAULT
          </ThemedText>
          <ThemedText type="title" style={{ color: "#005e36", marginTop: -19 }}>
            Welcome!
          </ThemedText>
          <TextInput
            label="Student ID"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            disabled={loading}
            onPress={handleLogin}
            style={styles.button}
          >
            Sign In
          </Button>
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 40,
            color: "#9BA1A6ff",
            fontWeight: "100",
            fontSize: 13,
          }}
        >
          Northwest Samar State University
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginTop: 0,
            color: "#9BA1A6ff",
            fontWeight: "100",
            fontSize: 9,
          }}
        >
          College of Computing and Information Science
        </Text>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 24,
    backgroundColor: "#fff",
  },
  innerContainer: {
    gap: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "white",
    fontSize: 13,
  },
  button: {
    marginTop: 16,
  },
  reactLogo: {
    height: 180,
    width: 200,
    objectFit: "contain",
  },
});
