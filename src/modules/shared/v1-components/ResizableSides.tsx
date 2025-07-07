import { clsx } from 'clsx';
import { type ReactNode, useRef, type FC, useCallback } from 'react';
import { useEventListener } from 'usehooks-ts';

export const ResizableSides: FC<{
  direction: 'row' | 'col';
  className?: string;
  sideOne: ReactNode;
  sideTwo: ReactNode;
}> = ({ direction, className, sideOne, sideTwo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const sideOneRef = useRef<HTMLDivElement>(null);
  const initialPosition = useRef<number | null>(null);
  const initialSize = useRef<number | null>(null);
  const position = useRef<number>(0);

  const startMovement = useCallback(
    (e: PointerEvent) => {
      if (!containerRef.current) return;
      initialPosition.current = direction === 'col' ? e.clientX : e.clientY;
      initialSize.current =
        sideOneRef.current?.getBoundingClientRect()?.[
          direction === 'col' ? 'width' : 'height'
        ] ?? null;
      containerRef.current.style.userSelect = 'none';
    },
    [direction],
  );

  const endMovement = useCallback(() => {
    if (initialPosition.current === null || !containerRef.current) return;
    initialPosition.current = null;
    initialSize.current = null;
    containerRef.current.style.userSelect = 'auto';
  }, []);

  const midMovement = useCallback(
    (e: PointerEvent) => {
      if (initialPosition.current === null || !containerRef.current) return;
      position.current = direction === 'col' ? e.clientX : e.clientY;
      if (initialSize.current === null || !sideOneRef.current) return;
      const movement = position.current - initialPosition.current;

      const newSize = initialSize.current + movement;
      sideOneRef.current.style[
        direction === 'col' ? 'width' : 'height'
      ] = `${newSize}px`;

      e.preventDefault();
    },
    [direction],
  );

  useEventListener('pointerdown', startMovement, dividerRef);
  useEventListener('pointerup', endMovement);
  useEventListener('pointerleave', endMovement);
  useEventListener('pointermove', midMovement);

  return (
    <div
      className={clsx(
        'flex items-stretch justify-stretch',
        direction === 'row' && 'flex-col',
        className,
      )}
      ref={containerRef}
    >
      <div ref={sideOneRef} className="min-h-[15%] min-w-[15%] shrink">
        {sideOne}
      </div>
      <div
        className={clsx(
          'group relative flex items-center justify-center',
          direction === 'row'
            ? 'h-3 max-h-3 min-h-3 w-full cursor-row-resize'
            : 'h-full w-3 min-w-3 max-w-3 cursor-col-resize',
        )}
        ref={dividerRef}
      >
        <div
          className={clsx(
            'absolute bg-v1-content-primary/10 transition-all',
            direction === 'row'
              ? 'h-2 w-full group-hover:scale-y-150'
              : 'h-full w-2 group-hover:scale-x-150',
          )}
        />
        <div
          className={clsx(
            'relative border-v1-content-primary/50 transition-all group-hover:border-v1-content-primary/75',
            direction === 'row'
              ? 'h-1 w-4 border-x-0 border-y'
              : 'h-4 w-1 border-x border-y-0',
          )}
        />
      </div>
      <div className="min-h-[15%] min-w-[15%] shrink">{sideTwo}</div>
    </div>
  );
};
