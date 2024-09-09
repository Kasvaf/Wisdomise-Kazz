import { type TabsProps } from 'antd';
import { type ReactNode, useEffect, useRef, useState } from 'react';

export const useScrollPointTabs = (
  items: Array<{
    key: string;
    label: ReactNode;
  }>,
  threshold?: number,
): Partial<TabsProps> => {
  const [activeKey, setActiveKey] = useState(items[0].key);
  const ignoreScroll = useRef(false);

  useEffect(() => {
    const scrollingElement = document.querySelector('#scrolling-element');
    let timeout: ReturnType<typeof setTimeout>;
    if (!scrollingElement) return;
    const scrollHandler = () => {
      if (ignoreScroll.current) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        let viewportedEl: { top: number; el: HTMLElement } | null = null;
        for (const item of items) {
          const el = document.querySelector<HTMLElement>(`#${item.key}`);
          if (!el) continue;
          const { top } = el.getBoundingClientRect();
          if (
            !viewportedEl ||
            (top <= (threshold ?? 0) &&
              Math.abs(top) <= Math.abs(viewportedEl.top))
          )
            viewportedEl = {
              top,
              el,
            };
        }
        if (viewportedEl) {
          setActiveKey(viewportedEl.el.id);
        }
      }, 10);
    };
    scrollingElement.addEventListener('scroll', scrollHandler);
    return () => {
      scrollingElement.removeEventListener('scroll', scrollHandler);
    };
  }, [items, threshold]);

  const handleClick = (newActiveKey: string) => {
    if (!newActiveKey) return;
    const scrollingElement = document.querySelector('#scrolling-element');
    const el = document.querySelector(`#${newActiveKey}`);
    if (!scrollingElement || !el) return;
    ignoreScroll.current = true;
    try {
      setTimeout(() => {
        ignoreScroll.current = false;
      }, 1500);
    } catch {}
    setActiveKey(newActiveKey);
    scrollingElement.scrollTo({
      top:
        scrollingElement.scrollTop +
        20 +
        el.getBoundingClientRect().y -
        (threshold ?? 0),
      behavior: 'smooth',
    });
  };

  return {
    activeKey,
    items,
    onTabClick: handleClick,
  };
};
