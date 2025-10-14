import { type MetaToken, useMetaListQuery } from 'api/meta';
import { bxSearch } from 'boxicons-quasar';
import dayjs from 'dayjs';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import PageWrapper from 'modules/base/PageWrapper';
import { Filters } from 'modules/discovery/ListView/Filters';
import { calcColorByThreshold } from 'modules/discovery/ListView/NetworkRadar/lib';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import Icon from 'shared/Icon';
import { PageTitle } from 'shared/PageTitle';
import { ReadableNumber } from 'shared/ReadableNumber';
import Spinner from 'shared/Spinner';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Checkbox } from 'shared/v1-components/Checkbox';
import { Coin, CoinImage } from 'shared/v1-components/Coin';
import { Input } from 'shared/v1-components/Input';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { EmptyContent } from 'shared/v1-components/Table/EmptyContent';
import { useDebounce, useIntersectionObserver } from 'usehooks-ts';

export interface MetaFilters {
  minTotalVolume?: number;
  maxTotalVolume?: number;
  minTotalMarketCap?: number;
  maxTotalMarketCap?: number;
}

const defaultValue = {
  minTotalVolume: undefined,
  maxTotalVolume: undefined,
  minTotalMarketCap: undefined,
  maxTotalMarketCap: undefined,
};

export default function PageMeta() {
  const [sortByActivate, setSortByActivate] = useState(false);
  const [skipSimilar, setSkipSimilar] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { settings, updateMetaFilters } = useUserSettings();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const io = useIntersectionObserver(loadMoreRef, {});

  const getMcColor = (mc?: number) => {
    return calcColorByThreshold({
      value: mc,
      rules: [
        { limit: 200_000, color: '#0edcdc' },
        { limit: 1_000_000, color: '#FFDA6C' },
      ],
      fallback: '#00ffa3',
    });
  };

  const filters = settings.meta.filters;
  const { data, isPending, fetchNextPage, isFetchingNextPage } =
    useMetaListQuery({
      recentlyActive: sortByActivate,
      minTotalVolume: filters?.minTotalVolume,
      maxTotalVolume: filters?.maxTotalVolume,
      minTotalMarketCap: filters?.minTotalMarketCap,
      maxTotalMarketCap: filters?.maxTotalMarketCap,
      skipSimilar,
      query: debouncedQuery,
    });

  useEffect(() => {
    if (io?.isIntersecting && !isPending) {
      void fetchNextPage();
    }
  }, [io?.isIntersecting, fetchNextPage, isPending]);

  return (
    <PageWrapper extension={<CoinExtensionsGroup />}>
      <PageTitle className="mb-3" title="Meta" />
      <div className="flex items-center gap-2 max-md:flex-wrap">
        <span className="shrink-0 text-white/50 text-xs">Sorted By</span>
        <ButtonSelect
          className="shrink-0"
          onChange={setSortByActivate}
          options={[
            { value: false, label: 'Recently Created' },
            { value: true, label: 'Recently Active' },
          ]}
          size="sm"
          surface={1}
          value={sortByActivate}
          variant="primary"
        />
        <Filters
          dialog={(value, setValue) => (
            <div>
              <div className="flex flex-col items-start gap-2">
                <p className="text-xs">Total MarketCap</p>
                <div className="flex w-full items-center gap-3">
                  <Input
                    block
                    className="basis-1/2"
                    min={0}
                    onChange={min =>
                      setValue(p => ({
                        ...p,
                        minTotalMarketCap: min,
                      }))
                    }
                    placeholder="Min"
                    size="md"
                    type="number"
                    value={value.minTotalMarketCap}
                  />
                  <Input
                    block
                    className="basis-1/2"
                    min={0}
                    onChange={max =>
                      setValue(p => ({
                        ...p,
                        maxTotalMarketCap: max,
                      }))
                    }
                    placeholder="Max"
                    size="md"
                    type="number"
                    value={value.maxTotalMarketCap}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col items-start gap-2">
                <p className="text-xs">Total Volume</p>
                <div className="flex w-full items-center gap-3">
                  <Input
                    block
                    className="basis-1/2"
                    min={0}
                    onChange={min =>
                      setValue(p => ({
                        ...p,
                        minTotalVolume: min,
                      }))
                    }
                    placeholder="Min"
                    size="md"
                    type="number"
                    value={value.minTotalVolume}
                  />
                  <Input
                    block
                    className="basis-1/2"
                    min={0}
                    onChange={max =>
                      setValue(p => ({
                        ...p,
                        maxTotalVolume: max,
                      }))
                    }
                    placeholder="Max"
                    size="md"
                    type="number"
                    value={value.maxTotalVolume}
                  />
                </div>
              </div>
            </div>
          )}
          onChange={updateMetaFilters}
          resetValue={defaultValue}
          size="sm"
          value={filters}
        />
        <Checkbox
          className="ml-auto shrink-0"
          label="Skip Similar Groups"
          onChange={setSkipSimilar}
          size="md"
          value={skipSimilar}
        />
        <Input
          className="shrink-0"
          onChange={setQuery}
          placeholder="Search Narrative"
          prefixIcon={<Icon className="text-white/50" name={bxSearch} />}
          size="sm"
          surface={1}
          type="string"
          value={query}
        />
      </div>

      {data?.pages.length === 0 ? (
        <EmptyContent />
      ) : (
        <div className="mx-auto mt-5 max-w-[40rem] text-xs">
          {data?.pages.flatMap(page =>
            page.results.map(meta => {
              const latestToken = [...meta.trench].sort(
                (a, b) =>
                  new Date(b.symbol.created_at).getTime() -
                  new Date(a.symbol.created_at).getTime(),
              )[0];

              return (
                <div
                  className="mb-3 flex h-[35rem] gap-3 rounded-xl bg-v1-surface-l1 p-3"
                  key={meta.id}
                >
                  <div className="flex h-full w-[16rem] min-w-[16rem] flex-col">
                    <div className="rounded-xl bg-v1-surface-l2 p-3">
                      <h2 className="mb-3 text-white/70">Narrative</h2>
                      <h3 className="mb-4 text-lg">{meta.title}</h3>
                      <div className="relative h-24">
                        <p className="h-full overflow-auto pb-4 text-white/70">
                          {meta.description}
                        </p>
                        <div className="absolute bottom-0 h-4 w-full bg-gradient-to-b from-transparent to-v1-surface-l2"></div>
                      </div>
                      <hr className="my-3 border-white/10" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Created at</span>
                          <span>{dayjs(meta.created_at).fromNow()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Last Token</span>
                          <span>
                            {dayjs(latestToken?.symbol.created_at).fromNow()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total Volume</span>
                          <ReadableNumber value={meta.total_volume} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total MarketCap</span>
                          <div
                            className="font-medium text-base"
                            style={{ color: getMcColor(meta.total_market_cap) }}
                          >
                            <ReadableNumber value={meta.total_market_cap} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grow overflow-auto rounded-xl bg-v1-surface-l2 p-3">
                      <h2 className="mb-3 text-white/70">Gallery</h2>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {meta.trench.map(token => (
                          <CoinImage
                            key={token.symbol.contract_address}
                            name={token.symbol.abbreviation}
                            src={token.symbol.logo_url}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-full grow overflow-auto rounded-xl bg-v1-surface-l2 p-3">
                    <h2 className="mb-3 text-white/70">Tokens</h2>
                    <TokensTable dataSource={meta.trench} />
                  </div>
                </div>
              );
            }),
          )}
        </div>
      )}
      <div ref={loadMoreRef} />
      {(isFetchingNextPage || isPending) && (
        <Spinner className="mx-auto my-10" />
      )}
    </PageWrapper>
  );
}

function TokensTable({ dataSource }: { dataSource: MetaToken[] }) {
  const columns = useMemo<TableColumn<MetaToken>[]>(
    () => [
      {
        key: 'token',
        render: row => (
          <Coin
            abbreviation={row.symbol.abbreviation}
            href={`/token/solana/${row.symbol.contract_address}`}
            logo={row.symbol.logo_url}
            name={row.symbol.name}
          />
        ),
      },
      {
        key: 'details',
        render: row => (
          <div>
            <p className="text-white/70 text-xs">MC</p>
            <ReadableNumber value={row.symbol_market_data?.market_cap} />
          </div>
        ),
      },
    ],
    [],
  );
  return <Table columns={columns} dataSource={dataSource} />;
}
