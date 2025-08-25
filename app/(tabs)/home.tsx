import { baseUrl, injectedJavaScript } from "@/constants/consts";
import { useUserStore } from "@/hooks/user";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

export default function TabTwoScreen() {
  const { userId } = useUserStore();
  const defaultUrl = `${baseUrl}/mobile/${userId}/student`;
  const [url, setUrl] = useState(defaultUrl);
  const webViewRef = useRef<WebView>(null);

  useFocusEffect(
    useCallback(() => {
      // Instead of remounting WebView, just update its source
      setUrl(defaultUrl);
    }, [defaultUrl])
  );

  return (
    <View style={styles.view}>
      <WebView
        ref={webViewRef}
        style={styles.container}
        source={{ uri: url }}
        javaScriptEnabled
        scalesPageToFit={false}
        injectedJavaScript={injectedJavaScript}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  view: {
    flex: 1,
  },
});
