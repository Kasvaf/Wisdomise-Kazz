import { clsx } from 'clsx';
import { type FC, type ReactNode, useEffect, useRef } from 'react';

export type ResizableSidesValue = `${number}px` | `${number}%`;

export const ResizableSides: FC<{
  direction: 'row' | 'col';
  rootClassName?: string;
  className?: [string, string];
  children: [ReactNode, ReactNode];
  value?: ResizableSidesValue;
  onChange?: (newValue: ResizableSidesValue | undefined) => void;
}> = ({ direction, rootClassName, className, children, value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const sideOneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dividerEl = dividerRef.current;
    if (!dividerEl || !sideOneRef.current) return;

    if (value) {
      sideOneRef.current.style[direction === 'col' ? 'width' : 'height'] =
        value;
    }

    let initialPosition: number | null = null;
    let initialSize: number | null = null;
    let position: number | null = null;

    const midMovement = (e: PointerEvent) => {
      if (initialPosition === null || !containerRef.current) return;
      position = direction === 'col' ? e.clientX : e.clientY;
      if (initialSize === null || !sideOneRef.current) return;
      const movement = position - initialPosition;

      const newSize = initialSize + movement;
      sideOneRef.current.style[direction === 'col' ? 'width' : 'height'] =
        `${newSize}px`;

      e.preventDefault();
    };

    const endMovement = () => {
      if (!containerRef.current || !sideOneRef.current) return;
      onChange?.(
        sideOneRef.current.style[
          direction === 'col' ? 'width' : 'height'
        ] as never,
      );
      initialPosition = null;
      initialSize = null;
      containerRef.current.style.userSelect = 'auto';
      containerRef.current.style.pointerEvents = 'auto';
      document.body.style.cursor = 'default';
      window.removeEventListener('pointermove', midMovement);
      window.removeEventListener('pointerleave', endMovement);
      window.removeEventListener('pointerup', endMovement);
    };

    const startMovement = (e: PointerEvent) => {
      if (!containerRef.current) return;
      initialPosition = direction === 'col' ? e.clientX : e.clientY;
      initialSize =
        sideOneRef.current?.getBoundingClientRect()?.[
          direction === 'col' ? 'width' : 'height'
        ] ?? null;
      containerRef.current.style.userSelect = 'none';
      containerRef.current.style.pointerEvents = 'none';
      document.body.style.cursor =
        direction === 'col' ? 'col-resize' : 'row-resize';
      e.preventDefault();

      window.addEventListener('pointermove', midMovement);
      window.addEventListener('pointerleave', endMovement);
      window.addEventListener('pointerup', endMovement);
    };

    dividerEl.addEventListener('pointerdown', startMovement);

    return () => {
      window.removeEventListener('pointerdown', startMovement);
      window.removeEventListener('pointermove', midMovement);
      window.removeEventListener('pointerleave', endMovement);
      window.removeEventListener('pointerup', endMovement);
    };
  }, [direction, onChange, value]);

  return (
    <div
      className={clsx(
        'flex flex-nowrap items-stretch justify-stretch overflow-hidden',
        direction === 'row' && 'flex-col',
        rootClassName,
      )}
      ref={containerRef}
    >
      <div
        className={clsx(
          'scrollbar-thin relative shrink-0 overflow-auto',
          direction === 'row'
            ? 'max-h-[calc(100%-0.75rem)]'
            : 'max-w-[calc(100%-0.75rem)]',
          className?.[0],
        )}
        ref={sideOneRef}
      >
        {children[0]}
      </div>
      <div
        className={clsx(
          'group relative flex shrink-0 items-center justify-center',
          direction === 'row'
            ? 'h-3 max-h-3 min-h-3 w-full cursor-row-resize'
            : 'h-full w-3 min-w-3 max-w-3 cursor-col-resize',
        )}
        ref={dividerRef}
      >
        <div
          className={clsx(
            'absolute bg-v1-surface-l2 transition-all group-hover:bg-v1-surface-l3',
            direction === 'row' ? 'h-[5px] w-full' : 'h-full w-[5px]',
          )}
        />
        <div
          className={clsx(
            'relative border-v1-content-primary/50 transition-all group-hover:border-v1-content-primary/75',
            direction === 'row'
              ? 'h-[3px] w-4 border-x-0 border-y'
              : 'h-4 w-[3px] border-x border-y-0',
          )}
        />
      </div>
      <div
        className={clsx(
          'scrollbar-thin relative shrink overflow-auto',
          className?.[1],
        )}
      >
        {children[1]}
      </div>
    </div>
  );
};
