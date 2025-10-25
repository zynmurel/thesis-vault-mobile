import { baseUrl, injectedJavaScript } from "@/constants/consts";
import { useUserStore } from "@/hooks/user";
import { useCallback, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import WebView from "react-native-webview";

export default function TabTwoScreen() {
  const { userId } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Reload WebView after small delay
    setTimeout(() => {
      setRefreshing(false);
      webViewRef.current?.reload();
    }, 1000);
  }, []);

  const webViewRef = useRef<WebView>(null);
  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.view}>
        <WebView
          ref={webViewRef}
          style={styles.container}
          source={{
            uri: `${baseUrl}/mobile/${userId}/theses`,
          }}
          scalesPageToFit={false} // For Android
          javaScriptEnabled={true}
          injectedJavaScript={injectedJavaScript} // For iOS
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    height: "auto",
    width: "auto",
    backgroundColor: "white",
  },
  view: {
    flex: 1,
    height: "100%",
    width: "100%",
    overflow: "scroll",
  },
});
