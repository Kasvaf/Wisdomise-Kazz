import type { Meta, MetaToken } from 'api/meta';
import { bxPauseCircle, bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { calcColorByThreshold } from 'modules/discovery/ListView/NetworkRadar/lib';
import { type MetaTab, useMeta } from 'modules/discovery/PageMeta/lib';
import MetaTabsFilters from 'modules/discovery/PageMeta/MetaTabsFilters';
import { useMemo, useState } from 'react';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Input } from 'shared/v1-components/Input';
import Spin from 'shared/v1-components/Spin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';

export default function MetaList({
  title,
  tab,
  skipSimilar,
}: {
  title: string;
  tab: MetaTab;
  skipSimilar?: boolean;
}) {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useMeta({ tab, query, skipSimilar });

  const hovered = false;
  return (
    <div className="scrollbar-none flex min-h-screen flex-col gap-3 overflow-auto rounded-lg">
      <div className="scrollbar-none sticky top-0 z-10 flex shrink-0 items-center gap-2 overflow-auto whitespace-nowrap rounded-lg bg-v1-surface-l-next px-3 py-2 text-sm shadow-xl">
        <div
          className={clsx(
            hovered ? 'pointer-events-none opacity-100' : 'opacity-0',
            'absolute inset-0 size-full bg-v1-background-brand/10 transition-all',
          )}
        />
        <h3 className="relative">{title}</h3>
        {isLoading && <Spin />}
        <div
          className={clsx(
            'flex items-center gap-1 text-v1-content-brand text-xs transition-all',
            !hovered && 'hidden',
          )}
        >
          <Icon name={bxPauseCircle} size={18} />
        </div>
        <div className="relative flex w-auto shrink-0 grow items-center justify-end gap-2">
          <MetaTabsFilters initialTab={tab} />
          <Input
            className="!px-2 absolute right-9 z-10 w-9 focus-within:w-72 focus-within:px-3"
            onChange={newVal => {
              setQuery(newVal);
            }}
            placeholder="Search by Name/Address (2+ chars)"
            prefixIcon={<Icon name={bxSearch} />}
            size="xs"
            surface={2}
            type="string"
            value={query}
          />
        </div>
      </div>
      <div className="flex flex-col text-xs">
        {data?.pages.flatMap(page =>
          page.results.map(meta => {
            return <MetaNarrative key={meta.id} meta={meta} />;
          }),
        )}
      </div>
    </div>
  );
}

function MetaNarrative({ meta }: { meta: Meta }) {
  const latestToken = [...meta.trench].sort(
    (a, b) =>
      new Date(b.symbol.created_at).getTime() -
      new Date(a.symbol.created_at).getTime(),
  )[0];

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

  return (
    <div
      className="mb-3 flex h-[35rem] flex-col gap-3 rounded-xl bg-v1-surface-l1 p-3"
      key={meta.id}
    >
      <div className="rounded-xl bg-v1-surface-l2 p-3">
        <h2 className="mb-3 text-white/70">Narrative</h2>
        <h3 className="mb-4 text-lg">{meta.title}</h3>
        <DescriptionWithToggle description={meta.description} />
        <hr className="my-3 border-white/10" />
        <div className="flex gap-3">
          <div className="w-1/2 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Created at</span>
              <span>{dayjs(meta.created_at).fromNow()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Last Token</span>
              <span>{dayjs(latestToken?.symbol.created_at).fromNow()}</span>
            </div>
          </div>
          <div className="h-10 border-white/10 border-r" />
          <div className="w-1/2 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Total Volume</span>
              <ReadableNumber
                format={{ decimalLength: 1 }}
                value={meta.total_volume}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Total MC</span>
              <div
                className="font-medium text-base"
                style={{ color: getMcColor(meta.total_market_cap) }}
              >
                <ReadableNumber
                  format={{ decimalLength: 1 }}
                  value={meta.total_market_cap}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grow overflow-auto rounded-xl bg-v1-surface-l2 p-3">
        <h2 className="mb-3 text-white/70">Top Tokens</h2>
        <TokensTable dataSource={meta.trench} />
      </div>
    </div>
  );
}

function TokensTable({ dataSource }: { dataSource: MetaToken[] }) {
  const columns = useMemo<TableColumn<MetaToken>[]>(
    () => [
      {
        key: 'token',
        render: row => (
          <Token
            abbreviation={row.symbol.abbreviation}
            address={row.symbol.contract_address}
            logo={row.symbol.logo_url}
            name={row.symbol.name}
            showAddress={false}
          />
        ),
      },
      {
        key: 'details',
        render: row => (
          <div>
            <p className="text-white/70 text-xs">MC</p>
            <ReadableNumber
              format={{ decimalLength: 1 }}
              value={row.symbol_market_data?.market_cap}
            />
          </div>
        ),
      },
    ],
    [],
  );
  return <Table columns={columns} dataSource={dataSource.slice(0, 10)} />;
}

function DescriptionWithToggle({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={clsx(
        'relative flex gap-1',
        expanded ? 'flex-col items-start' : 'items-center',
      )}
    >
      <p className={clsx('text-white/70', !expanded && 'line-clamp-1')}>
        {description}
      </p>
      <button
        className="shrink-0 text-v1-content-brand"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
}
