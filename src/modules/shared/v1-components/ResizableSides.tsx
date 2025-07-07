import { clsx } from 'clsx';
import { type ReactNode, useRef, type FC, useEffect } from 'react';

export const ResizableSides: FC<{
  direction: 'row' | 'col';
  className?: string;
  sideOne: ReactNode;
  sideTwo: ReactNode;
}> = ({ direction, className, sideOne, sideTwo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const sideOneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dividerEl = dividerRef.current;
    if (!dividerEl) return;

    let initialPosition: number | null = null;
    let initialSize: number | null = null;
    let position: number | null = null;

    const midMovement = (e: PointerEvent) => {
      if (initialPosition === null || !containerRef.current) return;
      position = direction === 'col' ? e.clientX : e.clientY;
      if (initialSize === null || !sideOneRef.current) return;
      const movement = position - initialPosition;

      const newSize = initialSize + movement;
      sideOneRef.current.style[
        direction === 'col' ? 'width' : 'height'
      ] = `${newSize}px`;

      e.preventDefault();
    };

    const endMovement = () => {
      if (!containerRef.current) return;
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
  });

  return (
    <div
      className={clsx(
        'flex items-stretch justify-stretch',
        direction === 'row' && 'flex-col',
        className,
      )}
      ref={containerRef}
    >
      <div
        ref={sideOneRef}
        className={clsx(
          'shrink-0 overflow-hidden',
          direction === 'row'
            ? 'max-h-[calc(100%-0.75rem)]'
            : 'min-w-[calc(100%-0.75rem)]',
        )}
      >
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
      <div className={clsx('shrink overflow-hidden')}>{sideTwo}</div>
    </div>
  );
};
