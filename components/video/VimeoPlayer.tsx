import { useEffect, useRef } from "react";
import Player from "@vimeo/player";

export default function VimeoPlayer({
  vimeoId,
  onProgress,
  onEnded,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !vimeoId) return;

    const player = new Player(containerRef.current, {
      id: vimeoId,
      responsive: true,
      controls: true,
    });

    playerRef.current = player;

    let lastSent = 0;

    // ⏱ Progress tracking (throttled)
    player.on("timeupdate", (data) => {
      const now = Date.now();
      if (now - lastSent > 5000) {
        lastSent = now;
        onProgress?.(data.seconds, data.duration);
      }
    });

    player.on("ended", () => {
      onEnded?.();
    });

    return () => {
      player.destroy();
    };
  }, [vimeoId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio: "9 / 16",
        borderRadius: 12,
        overflow: "hidden",
        background: "#000",
      }}
    />
  );
}
