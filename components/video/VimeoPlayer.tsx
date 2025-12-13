import { useEffect, useRef } from "react";
import Player from "@vimeo/player";

type VimeoPlayerProps = {
  vimeoId: number | string;
  onProgress?: (current: number, duration: number) => void;
  onEnded?: () => void;
};

export default function VimeoPlayer({
  vimeoId,
  onProgress,
  onEnded,
}: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  // 🔒 Stable refs for callbacks (CRITICAL FIX)
  const onProgressRef = useRef(onProgress);
  const onEndedRef = useRef(onEnded);

  // Update refs without re-creating player
  useEffect(() => {
    onProgressRef.current = onProgress;
    onEndedRef.current = onEnded;
  }, [onProgress, onEnded]);

  // 🎬 Create / destroy player ONLY when video ID changes
  useEffect(() => {
    if (!containerRef.current || !vimeoId) return;

    const player = new Player(containerRef.current, {
      id: vimeoId,
      responsive: true,
      controls: true,
    });

    playerRef.current = player;

    let lastSent = 0;

    // ⏱ Throttled progress tracking (every 5s)
    player.on("timeupdate", (data) => {
      const now = Date.now();
      if (now - lastSent >= 5000) {
        lastSent = now;
        onProgressRef.current?.(data.seconds, data.duration);
      }
    });

    player.on("ended", () => {
      onEndedRef.current?.();
    });

    return () => {
      player.destroy(); // ✅ runs ONLY when vimeoId changes or component unmounts
      playerRef.current = null;
    };
  }, [vimeoId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
      }}
    />
  );
}
