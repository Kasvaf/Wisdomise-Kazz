import { clsx } from 'clsx';
import { type PairDataFull } from 'api/types/strategy';
import { type PairSignalerItem } from 'api';
import useIsMobile from 'utils/useIsMobile';
import CarouselItems from 'shared/CarouselItems';
import PairBox from './PairBox';
import StrategyPositionBox from './StrategyPositionBox';

const PairSignals: React.FC<{
  pair: PairDataFull;
  signalers: PairSignalerItem[];
  noCoinBorder?: boolean;
}> = ({ pair, signalers, noCoinBorder = false }) => {
  const isMobile = useIsMobile();

  return (
    <div key={pair.name} className="flex gap-6 mobile:flex-col">
      {isMobile ? (
        <PairBox
          pair={pair}
          className={clsx(!noCoinBorder && 'rounded-xl bg-black/40 p-6')}
        >
          <div className="my-4 border-b border-white/10" />
          <CarouselItems
            Component={StrategyPositionBox}
            items={signalers.map(x => ({ key: x.strategy.key, position: x }))}
          />
        </PairBox>
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
