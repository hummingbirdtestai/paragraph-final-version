import { useRef, useState } from "react";

export function useScrollDirection() {
  const lastOffset = useRef(0);
  const [direction, setDirection] = useState<"up" | "down">("up");

  const onScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;

    if (y > lastOffset.current + 5) {
      setDirection("down");
    } else if (y < lastOffset.current - 5) {
      setDirection("up");
    }

    lastOffset.current = y;
  };

  return { direction, onScroll };
}
