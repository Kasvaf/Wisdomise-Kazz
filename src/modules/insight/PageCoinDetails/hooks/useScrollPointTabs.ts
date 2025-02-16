import { type TabsProps } from 'antd';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import useIsMobile from 'utils/useIsMobile';

const getScrollingElement = () => {
  const scrollingElement = document.scrollingElement ?? document.body;
  if (scrollingElement === null)
    throw new Error('scrolling-element not found!');
  const { height, top } = scrollingElement.getBoundingClientRect();
  return {
    height,
    top,
    eventTarget: scrollingElement,
  };
};

export const useScrollPointTabs = (
  items: Array<{
    key: string;
    label: ReactNode;
  }>,
  threshold: number,
): Partial<TabsProps> => {
  const [activeKey, setActiveKey] = useState(items[0].key);
  const ignoreScroll = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const { eventTarget: scrollingElement } = getScrollingElement();
    let timeout: ReturnType<typeof setTimeout>;
    if (!scrollingElement) return;

    const scrollHandler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (ignoreScroll.current) return;
        let closestItem = { key: '', distance: Number.POSITIVE_INFINITY };
        for (const item of items) {
          const el = document.querySelector<HTMLElement>(`#${item.key}`);
          if (!el) continue;
          const { top: elTop, height: elHeight } = el.getBoundingClientRect();
          const elCenter = elTop + elHeight / 2;
          const viewportCenter = window.innerHeight / 2 + threshold / 2;
          const distanceToCenter = Math.abs(elCenter - viewportCenter);
          if (distanceToCenter < closestItem.distance) {
            closestItem = { key: item.key, distance: distanceToCenter };
          }
        }

        setActiveKey(closestItem.key || items[0].key);
      }, 100);
    };
    scrollingElement.addEventListener('scroll', scrollHandler);
    return () => {
      scrollingElement.removeEventListener('scroll', scrollHandler);
    };
  }, [items, threshold, isMobile]);

  const handleClick = (newActiveKey: string) => {
    if (!newActiveKey) return;
    const el = document.querySelector(`#${newActiveKey}`);
    if (!el) return;
    ignoreScroll.current = true;
    try {
      setTimeout(() => {
        ignoreScroll.current = false;
      }, 1500);
    } catch {}
    setActiveKey(newActiveKey);
    el.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  };

  return {
    activeKey,
    items,
    onTabClick: handleClick,
  };
};
