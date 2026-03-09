import { useState, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PullToRefreshProps {
  onRefresh: () => Promise<unknown>;
  children: ReactNode;
}

const THRESHOLD = 60;

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const isMobile = useIsMobile();
  const [refreshing, setRefreshing] = useState(false);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const indicatorOpacity = useTransform(y, [0, THRESHOLD], [0, 1]);
  const indicatorScale = useTransform(y, [0, THRESHOLD], [0.5, 1]);
  const indicatorRotate = useTransform(y, [0, THRESHOLD * 2], [0, 360]);

  if (!isMobile) {
    return <>{children}</>;
  }

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.y >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center h-10 z-10"
        style={{ opacity: indicatorOpacity }}
      >
        <motion.div style={{ scale: indicatorScale, rotate: refreshing ? undefined : indicatorRotate }}>
          <Loader2 className={`h-5 w-5 text-primary ${refreshing ? "animate-spin" : ""}`} />
        </motion.div>
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        style={{ y }}
        dragListener={!refreshing}
        onDrag={(_, info) => {
          // Only allow pull down when at top of scroll
          if (containerRef.current && containerRef.current.scrollTop > 0) {
            y.set(0);
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
