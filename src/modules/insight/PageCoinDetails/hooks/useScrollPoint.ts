import { type ComponentProps, useEffect, useRef } from 'react';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { type ButtonSelect } from 'shared/v1-components/ButtonSelect';
import useIsMobile from 'utils/useIsMobile';

export const useScrollPoint = (
  options: ComponentProps<typeof ButtonSelect<string>>['options'],
  threshold: number,
): Pick<ComponentProps<typeof ButtonSelect<string>>, 'onChange' | 'value'> => {
  const [value, setValue] = useSearchParamAsState(
    'validateTab',
    options[0].value,
  );
  const ignoreScroll = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scrollHandler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (ignoreScroll.current) return;
        let closestItem = { value: '', distance: Number.POSITIVE_INFINITY };
        for (const item of options) {
          const el = document.querySelector<HTMLElement>(`#${item.value}`);
          if (!el) continue;
          const { top: elTop, height: elHeight } = el.getBoundingClientRect();
          const elCenter = elTop + elHeight / 2;
          const viewportCenter = window.innerHeight / 2 + threshold / 2;
          const distanceToCenter = Math.abs(elCenter - viewportCenter);
          if (distanceToCenter < closestItem.distance) {
            closestItem = { value: item.value, distance: distanceToCenter };
          }
        }

        setValue(closestItem.value || options[0].value);
      }, 100);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [options, threshold, isMobile, setValue]);

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
    setValue(newActiveKey);
    el.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  };

  return {
    value,
    onChange: handleClick,
  };
};
