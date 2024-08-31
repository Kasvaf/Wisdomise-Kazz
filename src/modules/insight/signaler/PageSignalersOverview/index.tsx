import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSignalerPairs, useSignalsQuery } from 'api';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import AssetSelector from 'modules/builder/AssetSelector';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import Spinner from 'shared/Spinner';
import Pager from 'shared/Pager';
import PairSignals from './PairSignals';

const PAGE_SIZE = 4;

const PageSignalersOverview = () => {
  const { t } = useTranslation('strategy');

  const [selected, setSelected] = useSearchParamAsState<string>('coin', '');
  const [page, setPage] = useState(1);
  const { data: positions, isLoading: isLoadingSignals } = useSignalsQuery();
  const { data: pairs, isLoading: isLoadingPairs } = useSignalerPairs();

  const pairsFull = useMemo(
    () =>
      pairs
        ?.map(pair => ({
          pair,
          signalers: positions?.filter(p => p.pair_name === pair.name) ?? [],
        }))
        .filter(p => p.signalers.length > 0)
        .sort(
          (a, b) =>
            // (b.social?.messages_count ?? 0) - (a.social?.messages_count ?? 0) ||
            (b.pair.time_window_prices.at(-1) ?? 0) -
            (a.pair.time_window_prices.at(-1) ?? 0),
        ) ?? [],
    [pairs, positions],
  );

  return (
    <PageWrapper>
      <PageTitle
        title={t('base:menu.signalers.title')}
        description={t('base:menu.signalers.subtitle')}
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
          ).map(({ pair, signalers }) => (
            <PairSignals key={pair.name} pair={pair} signalers={signalers} />
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
