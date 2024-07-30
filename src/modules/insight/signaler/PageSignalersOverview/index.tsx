import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoinSignals, useSignalerPairs, useSignalsQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import Spinner from 'shared/Spinner';
import PairBox from './PairBox';
import StrategyPositionBox from './StrategyPositionBox';

const PageSignalersOverview = () => {
  const { t } = useTranslation('strategy');

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
          {pairsFull.map(pair => (
            <div key={pair.pair.name} className="flex gap-6">
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
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default PageSignalersOverview;
