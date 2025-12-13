//BunnyMobilePlayer.tsx
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function BunnyMobilePlayer({
  videoUrl,
  posterUrl,
  onProgress,
  onEnded,
}) {
  if (!videoUrl) return null;

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <script src="https://player.bunny.net/js/bunny-player.min.js"></script>
    <style>
      body { margin:0; background:black; }
      #player { width:100vw; height:100vh; }
    </style>
  </head>
  <body>
    <div id="player"></div>
    <script>
      const player = BunnyPlayer.setup({
        container: document.getElementById("player"),
        hls: "${videoUrl}",
        poster: "${posterUrl || ""}",
        controls: true,
        autoplay: false
      });

      let lastSent = 0;

      player.on("timeupdate", (t) => {
        const now = Date.now();
      
        if (now - lastSent > 5000) {
          lastSent = now;
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "progress",
              current: t.currentTime,
              duration: t.duration
            })
          );
        }
      });


      player.on("ended", () => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "ended" })
        );
      });
    </script>
  </body>
</html>
`;

  return (
    <View style={{ height: 400, borderRadius: 12, overflow: "hidden" }}>
      <WebView
        source={{ html }}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction
        onMessage={(event) => {
          try {
            const msg = JSON.parse(event.nativeEvent.data);

            if (msg.type === "progress") {
              onProgress?.(msg.current, msg.duration);
            }

            if (msg.type === "ended") {
              onEnded?.();
            }
          } catch {}
        }}
      />
    </View>
  );
}
