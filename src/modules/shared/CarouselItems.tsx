import { clsx } from 'clsx';
import { useRef, useState } from 'react';

function CarouselItems<T>({
  Component,
  items,
}: {
  Component: React.FC<T>;
  items: Array<T & { key: string; className?: string }>;
}) {
  const scrollContEl = useRef<HTMLDivElement>(null);
  const contEl = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const scrollHandler = () => {
    if (!scrollContEl.current || !contEl.current) return;
    setActive(
      Math.round(scrollContEl.current.scrollLeft / contEl.current.clientWidth),
    );
  };

  return (
    <>
      <div
        ref={scrollContEl}
        onScroll={scrollHandler}
        className="-mx-6 snap-x snap-mandatory overflow-x-auto"
      >
        <div ref={contEl} className="flex gap-3 px-6 pb-3">
          {items.map(item => (
            <Component
              {...item}
              key={item.key}
              className={clsx('w-full shrink-0 snap-center', item.className)}
            />
          ))}
          <div className="w-3 shrink-0" />
        </div>
      </div>

      {items.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {items.map((p, ind) => (
            <div
              key={p.key}
              className={clsx(
                'h-3 w-3 cursor-pointer rounded-full',
                ind === active ? 'bg-info' : 'bg-white/5',
              )}
              onClick={() => {
                if (!contEl.current) return;
                scrollContEl.current?.scrollTo({
                  left: ind * contEl.current.clientWidth,
                  behavior: 'smooth',
                });
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default CarouselItems;
