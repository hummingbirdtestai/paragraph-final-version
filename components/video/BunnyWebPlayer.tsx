//BunnyWebPlayer.tsx
import { useEffect, useRef } from "react";

export default function BunnyWebPlayer({
  videoUrl,
  posterUrl,
  onProgress,
  onEnded,
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoUrl) return;
    if (!(window as any).BunnyPlayer) return;

    const player = (window as any).BunnyPlayer.setup({
      container: ref.current,
      hls: videoUrl,
      poster: posterUrl,
      controls: true,
      preload: "metadata",
    });

    player.on("timeupdate", (t) => {
      onProgress?.(t.currentTime, t.duration);
    });

    player.on("ended", () => {
      onEnded?.();
    });

    return () => {
      player.destroy?.();
    };
  }, [videoUrl]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        aspectRatio: "9 / 16",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    />
  );
}
