import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
// import "react-native-reanimated";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function RootLayout() {
  const webViewRef = useRef(null);
  const windowHeight = useWindowDimensions().height;

  const handleNavigation = (event) => {
    const url = event.url;

    if (
      url.includes("accounts.google.com") ||
      url.includes("oauth2") ||
      url.includes("google.com/signin")
    ) {
      setTimeout(() => {
        WebBrowser.openBrowserAsync(url);
      }, 0);
      return false;
    }

    return true;
  };

  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasPermission) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={"padding"}
          enabled={true}
          style={{ flex: 1 }}
        >
          <WebView
            ref={webViewRef}
            source={{ uri: "https://app.lipy.in" }}
            onShouldStartLoadWithRequest={handleNavigation}
            // style={styles.webview}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={["*"]}
            allowsFullscreenVideo={true}
            allowsBackForwardNavigationGestures
            allowsProtectedMedia
            allowsPopups
            allowsLinkPreview
            allowsAirPlayForMediaPlayback
            startInLoadingState={true}
            cacheEnabled={true}
            geolocationEnabled={true}
            javaScriptEnabledAndroid={true}
            mixedContentMode="compatibility"
            scalesPageToFit
            useWebKit
            // Important!
            allowsCameraAccess={true}
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
