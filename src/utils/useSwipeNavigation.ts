import type { PanInfo } from 'framer-motion';
import { useCallback } from 'react';

interface UseSwipeNavigationProps<T> {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  swipeThreshold?: number;
  velocityThreshold?: number;
}

interface SwipeNavigationHandlers {
  onDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => void;
  canSwipeLeft: boolean;
  canSwipeRight: boolean;
}

export function useSwipeNavigation<T>({
  tabs,
  activeTab,
  onTabChange,
  swipeThreshold = 50,
  velocityThreshold = 500,
}: UseSwipeNavigationProps<T>): SwipeNavigationHandlers {
  const currentIndex = tabs.indexOf(activeTab);

  const canSwipeLeft = currentIndex > 0;
  const canSwipeRight = currentIndex < tabs.length - 1;

  const onDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;

      // Swipe right (show previous tab)
      if (
        (offset.x > swipeThreshold || velocity.x > velocityThreshold) &&
        canSwipeLeft
      ) {
        onTabChange(tabs[currentIndex - 1]);
      }
      // Swipe left (show next tab)
      else if (
        (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) &&
        canSwipeRight
      ) {
        onTabChange(tabs[currentIndex + 1]);
      }
    },
    [
      currentIndex,
      tabs,
      onTabChange,
      swipeThreshold,
      velocityThreshold,
      canSwipeLeft,
      canSwipeRight,
    ],
  );

  return {
    onDragEnd,
    canSwipeLeft,
    canSwipeRight,
  };
}
