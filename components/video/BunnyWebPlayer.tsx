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

    let lastSent = 0;
    
    player.on("timeupdate", (t) => {
      const now = Date.now();
    
      // send only once every 5 seconds
      if (now - lastSent > 5000) {
        lastSent = now;
        onProgress?.(t.currentTime, t.duration);
      }
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
