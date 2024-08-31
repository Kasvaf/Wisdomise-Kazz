import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import { type PairDataFull } from 'api/types/strategy';
import { type PairSignalerItem } from 'api';
import useIsMobile from 'utils/useIsMobile';
import PairBox from './PairBox';
import StrategyPositionBox from './StrategyPositionBox';

const HorizontalPositions: React.FC<{
  pair: PairDataFull;
  signalers: PairSignalerItem[];
  className?: string;
}> = ({ signalers, pair, className }) => {
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
    <PairBox pair={pair} className={className}>
      <div className="my-4 border-b border-white/10" />
      <div
        ref={scrollContEl}
        onScroll={scrollHandler}
        className="-mx-6 snap-x snap-mandatory overflow-x-auto"
      >
        <div ref={contEl} className="flex gap-3 px-6 pb-3">
          {signalers.map(pos => (
            <StrategyPositionBox
              key={pos.strategy.key}
              position={pos}
              className="w-full shrink-0 snap-center"
            />
          ))}
          <div className="w-3 shrink-0" />
        </div>
      </div>

      {signalers.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {signalers.map((p, ind) => (
            <div
              key={p.strategy.key}
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
    </PairBox>
  );
};

const PairSignals: React.FC<{
  pair: PairDataFull;
  signalers: PairSignalerItem[];
  noCoinBorder?: boolean;
}> = ({ pair, signalers, noCoinBorder = false }) => {
  const isMobile = useIsMobile();

  return (
    <div key={pair.name} className="flex gap-6 mobile:flex-col">
      {isMobile ? (
        <HorizontalPositions
          pair={pair}
          signalers={signalers}
          className={clsx(!noCoinBorder && 'rounded-xl bg-black/40 p-6')}
        />
      ) : (
        <>
          <PairBox
            pair={pair}
            className={clsx(
              'w-2/5 max-w-[363px]',
              !noCoinBorder && 'rounded-xl bg-black/40 p-6',
            )}
          />
          <div
            className={clsx(
              'max-h-[533px] grow basis-3/5 overflow-y-auto',
              !noCoinBorder && 'rounded-xl bg-black/40',
            )}
          >
            <div
              className={clsx('flex flex-col gap-4', !noCoinBorder && 'p-6')}
            >
              {signalers.map(pos => (
                <StrategyPositionBox key={pos.strategy.key} position={pos} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PairSignals;
