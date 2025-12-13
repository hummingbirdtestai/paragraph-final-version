//UnifiedVideoPlayer.tsx
import { Platform } from "react-native";
import BunnyWebPlayer from "./BunnyWebPlayer";
import BunnyMobilePlayer from "./BunnyMobilePlayer";

export default function UnifiedVideoPlayer({
  videoUrl,
  posterUrl,
  onProgress,
  onEnded,
}) {
  if (Platform.OS === "web") {
    return (
      <BunnyWebPlayer
        videoUrl={videoUrl}
        posterUrl={posterUrl}
        onProgress={onProgress}
        onEnded={onEnded}
      />
    );
  }

  return (
    <BunnyMobilePlayer
      videoUrl={videoUrl}
      posterUrl={posterUrl}
      onProgress={onProgress}
      onEnded={onEnded}
    />
  );
}
