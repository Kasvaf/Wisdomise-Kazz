import { clsx } from 'clsx';
import { useRef, type FC, type ReactNode } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

export const Lazy: FC<{
  children?: ReactNode;
  className?: string;
  fallback?: ReactNode;
  freezeOnceVisible?: boolean;
  threshold?: number;
  rootMargin?: string;
  tag?: string;
}> = ({
  children = null,
  fallback = null,
  threshold = 0.4,
  freezeOnceVisible,
  rootMargin = '50%',
  className,
  tag = 'div',
}) => {
  const element = useRef<HTMLElement>(null);
  const intersection = useIntersectionObserver(element, {
    freezeOnceVisible,
    threshold,
    rootMargin,
  });
  const isVisible = intersection?.isIntersecting || null;
  const Root = tag as 'div';

  return (
    <Root className={clsx(className)} ref={element as never}>
      {isVisible ? children : fallback}
    </Root>
  );
};
