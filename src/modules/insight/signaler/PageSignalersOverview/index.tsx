import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePairsWithSignalers } from 'api';
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
  const { data, isLoading } = usePairsWithSignalers();

  return (
    <PageWrapper>
      <PageTitle
        title={t('base:menu.signalers.title')}
        description={t('base:menu.signalers.subtitle')}
        className="mb-8"
      />

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <AssetSelector
            assets={data.map(x => x.pair.name)}
            selectedItem={selected}
            onSelect={setSelected}
            className="w-64 mobile:w-full"
            all="All Coins"
          />
          {(selected
            ? data.filter(x => selected === x.pair.name)
            : data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
          ).map(({ pair, signalers }) => (
            <PairSignals key={pair.name} pair={pair} signalers={signalers} />
          ))}

          {!selected && (
            <Pager
              total={Math.ceil(data.length / PAGE_SIZE)}
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
