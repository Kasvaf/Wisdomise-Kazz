import { bxPauseCircle, bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { calcValueByThreshold } from 'modules/discovery/ListView/NetworkRadar/lib';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Meta, MetaToken } from 'services/rest/meta';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Dialog } from 'shared/v1-components/Dialog';
import { Input } from 'shared/v1-components/Input';
import Spin from 'shared/v1-components/Spin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';
import { type MetaTab, useMeta } from './lib';
import MetaTabsFilters from './MetaTabsFilters';

export default function MetaList({
  title,
  tab,
  skipSimilar,
}: {
  title: string;
  tab: MetaTab;
  skipSimilar?: boolean;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const { data, isLoading } = useMeta({ tab, query, skipSimilar });

  const hovered = false;
  return (
    <div className="scrollbar-none flex flex-col gap-3 overflow-auto rounded-lg">
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
            placeholder="Search"
            prefixIcon={<Icon name={bxSearch} />}
            size="xs"
            surface={2}
            type="string"
            value={query}
          />
        </div>
      </div>
      <div className="flex min-h-screen flex-col space-y-3 text-xs">
        {data?.pages.flatMap(p => p.results).length === 0 && !isLoading && (
          <p className="p-3 text-center text-v1-content-secondary text-xs leading-relaxed">
            {t('common:nothing-to-show')}
          </p>
        )}
        {data?.pages.flatMap(page =>
          page.results.map(meta => {
            return <MetaNarrative key={meta.id} meta={meta} />;
          }),
        )}
      </div>
    </div>
  );
}

export function MetaNarrative({
  meta,
  mode = 'card',
  className,
}: {
  meta: Meta;
  mode?: 'card' | 'dialog';
  className?: string;
}) {
  const latestToken = [...meta.trench].sort(
    (a, b) =>
      new Date(b.symbol.created_at).getTime() -
      new Date(a.symbol.created_at).getTime(),
  )[0];
  const [open, setOpen] = useState(false);

  const getMcColor = (mc?: number) => {
    return calcValueByThreshold({
      value: mc,
      rules: [
        { limit: 200_000, result: '#0edcdc' },
        { limit: 1_000_000, result: '#FFDA6C' },
      ],
      fallback: '#00ffa3',
    });
  };

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-xl bg-v1-surface-l1',
        mode === 'card' && 'h-[35rem] p-3',
        className,
      )}
      key={meta.id}
    >
      <div
        className={clsx(
          'rounded-xl bg-v1-surface-l2 p-3 transition-all',
          mode === 'card' && 'cursor-pointer hover:brightness-110',
        )}
        onClick={() => mode === 'card' && setOpen(true)}
      >
        <h2 className="mb-3 text-white/70">Narrative</h2>
        <h3 className="mb-4 text-lg">{meta.title}</h3>
        <div className="text-white/70">
          {mode === 'card' ? (
            <DescriptionWithToggle description={meta.description} />
          ) : (
            meta.description
          )}
        </div>
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
      <div
        className={clsx(
          'grow rounded-xl bg-v1-surface-l2 p-3',
          mode === 'card' && 'overflow-auto',
        )}
      >
        <h2 className="mb-3 text-white/70">Tokens</h2>
        <TokensTable
          count={mode === 'card' ? 10 : 100}
          dataSource={meta.trench}
        />
      </div>
      <Dialog
        className="max-w-lg text-xs"
        onClose={() => setOpen(false)}
        open={open}
      >
        <MetaNarrative className="p-3" meta={meta} mode="dialog" />
      </Dialog>
    </div>
  );
}

function TokensTable({
  dataSource,
  count = 10,
}: {
  dataSource: MetaToken[];
  count?: number;
}) {
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
  return <Table columns={columns} dataSource={dataSource.slice(0, count)} />;
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
      <p className={clsx(!expanded && 'line-clamp-1')}>{description}</p>
      <button
        className="shrink-0 text-v1-content-brand"
        onClick={e => {
          setExpanded(prev => !prev);
          e.stopPropagation();
        }}
      >
        {expanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
}
