// BunnyWebPlayer.tsx
import { useEffect, useRef } from "react";

export default function BunnyWebPlayer({
  videoUrl,
  posterUrl,
  onProgress,
  onEnded,
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoUrl || !ref.current) return;

    let player: any = null;
    let tries = 0;
    let destroyed = false;

    const init = () => {
      if (destroyed) return;

      if ((window as any).BunnyPlayer) {
        player = (window as any).BunnyPlayer.setup({
          container: ref.current,
          hls: videoUrl,
          poster: posterUrl,
          controls: true,
        });

        let lastSent = 0;

        player.on("timeupdate", (t) => {
          const now = Date.now();
          if (now - lastSent > 5000) {
            lastSent = now;
            onProgress?.(t.currentTime, t.duration);
          }
        });

        player.on("ended", () => {
          onEnded?.();
        });
      } else if (tries < 10) {
        tries++;
        setTimeout(init, 300);
      } else {
        console.error("❌ BunnyPlayer failed to load");
      }
    };

    init();

    return () => {
      destroyed = true;
      player?.destroy?.();
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
