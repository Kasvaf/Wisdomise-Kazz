import { type TabsProps } from 'antd';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import useIsMobile from 'utils/useIsMobile';

const getScrollingElement = (isMobile: boolean) => {
  if (!isMobile) {
    const scrollingElement = document.querySelector('#scrolling-element');
    if (scrollingElement === null)
      throw new Error('#scrolling-element not found!');
    const { height, top } = scrollingElement.getBoundingClientRect();
    return {
      height,
      top,
      eventTarget: scrollingElement,
    };
  }
  return {
    height: window.innerHeight,
    top: 0,
    eventTarget: window,
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
    const {
      eventTarget: scrollingElement,
      top: scrollElTop,
      height: scrollElHeight,
    } = getScrollingElement(isMobile);
    let timeout: ReturnType<typeof setTimeout>;
    if (!scrollingElement) return;

    const scrollHandler = () => {
      if (ignoreScroll.current) return;
      clearTimeout(timeout);
      let activeEl: {
        score: number;
        el: HTMLElement;
      } | null = null;
      timeout = setTimeout(() => {
        for (const item of items) {
          const el = document.querySelector<HTMLElement>(`#${item.key}`);
          if (!el) continue;
          const { top: elTop, height: elHeight } = el.getBoundingClientRect();
          let score = 0;
          score +=
            elTop < scrollElHeight + scrollElTop && elTop > scrollElTop * -1
              ? 1
              : 0;
          score +=
            elTop - (elHeight - scrollElTop) < 0 &&
            Math.abs(elTop - (elHeight - scrollElTop)) <
              scrollElTop + scrollElHeight
              ? 1
              : 0;
          if (!activeEl || score > activeEl.score) {
            activeEl = {
              score,
              el,
            };
          }
        }
        if (activeEl) {
          setActiveKey(activeEl.el.id);
        }
      }, 10);
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
      block: 'end',
      behavior: 'smooth',
    });
  };

  return {
    activeKey,
    items,
    onTabClick: handleClick,
  };
};
