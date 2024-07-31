import { clsx } from 'clsx';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type PairSignalerItem,
  useCoinSignals,
  useSignalerPairs,
  useSignalsQuery,
} from 'api';
import useIsMobile from 'utils/useIsMobile';
import PageWrapper from 'modules/base/PageWrapper';
import AssetSelector from 'modules/builder/AssetSelector';
import { PageTitle } from 'shared/PageTitle';
import Spinner from 'shared/Spinner';
import Pager from 'shared/Pager';
import PairBox from './PairBox';
import StrategyPositionBox from './StrategyPositionBox';

const HorizontalPositions: React.FC<{
  positions: PairSignalerItem[];
  pairName: string;
}> = ({ positions, pairName }) => {
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
    <PairBox pairName={pairName}>
      <div className="my-4 border-b border-white/10" />
      <div
        ref={scrollContEl}
        onScroll={scrollHandler}
        className="-mx-6 snap-x snap-mandatory overflow-x-auto"
      >
        <div ref={contEl} className="flex gap-3 px-6 pb-3">
          {positions.map(pos => (
            <StrategyPositionBox
              key={pos.strategy.key}
              position={pos}
              className="w-full shrink-0 snap-center flex-col"
            />
          ))}
          <div className="w-3 shrink-0" />
        </div>
      </div>

      {positions.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {positions.map((p, ind) => (
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

const PAGE_SIZE = 4;

const PageSignalersOverview = () => {
  const { t } = useTranslation('strategy');
  const isMobile = useIsMobile();

  const [selected, setSelected] = useState('');
  const [page, setPage] = useState(1);
  const { data: radar } = useCoinSignals();
  const { data: positions, isLoading: isLoadingSignals } = useSignalsQuery();
  const { data: pairs, isLoading: isLoadingPairs } = useSignalerPairs();

  const pairsFull = useMemo(
    () =>
      pairs
        ?.map(pair => ({
          pair,
          positions: positions?.filter(p => p.pair_name === pair.name) ?? [],
          social: radar?.find(x => x.symbol_name === pair.base.name),
        }))
        .filter(p => p.positions.length > 0)
        .sort(
          (a, b) =>
            // (b.social?.messages_count ?? 0) - (a.social?.messages_count ?? 0) ||
            (b.pair.time_window_prices.at(-1) ?? 0) -
            (a.pair.time_window_prices.at(-1) ?? 0),
        ) ?? [],
    [pairs, positions, radar],
  );

  return (
    <PageWrapper>
      <PageTitle
        title={t('base:menu.signalers.title')}
        description={t('base:menu.signalers.description')}
        className="mb-8"
      />

      {isLoadingPairs || isLoadingSignals ? (
        <div className="mt-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <AssetSelector
            assets={pairsFull.map(x => x.pair.name)}
            selectedItem={selected}
            onSelect={setSelected}
            className="w-64 mobile:w-full"
            all="All Coins"
          />
          {(selected
            ? pairsFull.filter(x => selected === x.pair.name)
            : pairsFull.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
          ).map(pair => (
            <div key={pair.pair.name} className="flex gap-6 mobile:flex-col">
              {isMobile ? (
                <HorizontalPositions
                  pairName={pair.pair.name}
                  positions={pair.positions}
                />
              ) : (
                <>
                  <PairBox
                    pairName={pair.pair.name}
                    className="w-2/5 max-w-[363px]"
                  />
                  <div className="h-[481px] w-3/5 overflow-y-auto rounded-xl bg-black/40">
                    <div className="flex flex-col gap-4 p-6">
                      {pair.positions.map(pos => (
                        <StrategyPositionBox
                          key={pos.strategy.key}
                          position={pos}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {!selected && (
            <Pager
              total={Math.ceil(pairsFull.length / PAGE_SIZE)}
              active={page}
              onChange={setPage}
              className="mx-auto justify-center"
            />
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default PageSignalersOverview;
