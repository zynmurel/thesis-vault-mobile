import { baseUrl, injectedJavaScript } from "@/constants/consts";
import { useUserStore } from "@/hooks/user";
import { StyleSheet, View } from "react-native";

import WebView from "react-native-webview";

export default function TabTwoScreen() {
  const { userId } = useUserStore();
  return (
    <View style={styles.view}>
      <WebView
        style={styles.container}
        source={{
          uri: `${baseUrl}/mobile/${userId}/theses`,
        }}
        scalesPageToFit={false} // For Android
        javaScriptEnabled={true}
        injectedJavaScript={injectedJavaScript} // For iOS
      />
    </View>
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
