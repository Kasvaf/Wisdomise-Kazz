import {
  bxFilter,
  bxLock,
  bxMessage,
  bxRotateLeft,
  bxSort,
} from 'boxicons-quasar';
import Icon from 'modules/shared/Icon';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { Toggle } from 'modules/shared/v1-components/Toggle';
import { useState } from 'react';

interface Transaction {
  id: string;
  amountUsd: number;
  marketCap: string;
  trader: string;
  age: string;
  type: 'buy' | 'sell';
  hasMessage?: boolean;
  hasWarning?: boolean;
  isLocked?: boolean;
}

// Demo transaction data
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amountUsd: 0.59,
    marketCap: '$1.17M',
    trader: 'orf*',
    age: '38s',
    type: 'buy',
  },
  {
    id: '2',
    amountUsd: 146.4,
    marketCap: '$1.17M',
    trader: 'aV5',
    age: '1m',
    type: 'sell',
    isLocked: true,
  },
  {
    id: '3',
    amountUsd: 11.9,
    marketCap: '$1.17M',
    trader: 'Fo3',
    age: '2m',
    type: 'buy',
  },
  {
    id: '4',
    amountUsd: 36.9,
    marketCap: '$1.17M',
    trader: 'JDy',
    age: '2m',
    type: 'sell',
  },
  {
    id: '5',
    amountUsd: 144.2,
    marketCap: '$1.17M',
    trader: 'FNQ*',
    age: '3m',
    type: 'buy',
  },
  {
    id: '6',
    amountUsd: 93.06,
    marketCap: '$1.17M',
    trader: 'T65',
    age: '3m',
    type: 'sell',
  },
  {
    id: '7',
    amountUsd: 193.6,
    marketCap: '$1.18M',
    trader: '6sX',
    age: '4m',
    type: 'buy',
    hasMessage: true,
  },
  {
    id: '8',
    amountUsd: 21.52,
    marketCap: '$1.18M',
    trader: '358',
    age: '4m',
    type: 'sell',
    hasMessage: true,
  },
  {
    id: '9',
    amountUsd: 3.98,
    marketCap: '$1.18M',
    trader: 'wCp',
    age: '4m',
    type: 'buy',
  },
  {
    id: '10',
    amountUsd: 116.3,
    marketCap: '$1.18M',
    trader: 'Dnr',
    age: '5m',
    type: 'sell',
    isLocked: true,
  },
  {
    id: '11',
    amountUsd: 4.5,
    marketCap: '$1.18M',
    trader: '8Ap',
    age: '5m',
    type: 'buy',
  },
  {
    id: '12',
    amountUsd: 28.92,
    marketCap: '$1.19M',
    trader: '3XJ',
    age: '5m',
    type: 'sell',
  },
  {
    id: '13',
    amountUsd: 2.63,
    marketCap: '$1.19M',
    trader: 'tJx',
    age: '5m',
    type: 'buy',
  },
  {
    id: '14',
    amountUsd: 9.91,
    marketCap: '$1.18M',
    trader: 'ttP',
    age: '6m',
    type: 'sell',
  },
  {
    id: '15',
    amountUsd: 54.58,
    marketCap: '$1.2M',
    trader: 'RjR',
    age: '6m',
    type: 'buy',
  },
  {
    id: '16',
    amountUsd: 249.2,
    marketCap: '$1.18M',
    trader: '3Eq',
    age: '6m',
    type: 'sell',
    hasWarning: true,
  },
  {
    id: '17',
    amountUsd: 0.65,
    marketCap: '$1.19M',
    trader: 'pEt',
    age: '7m',
    type: 'buy',
    hasMessage: true,
  },
  {
    id: '18',
    amountUsd: 5.32,
    marketCap: '$1.17M',
    trader: 'tJx',
    age: '7m',
    type: 'sell',
  },
  {
    id: '19',
    amountUsd: 104.4,
    marketCap: '$1.18M',
    trader: 'qND',
    age: '8m',
    type: 'buy',
  },
  {
    id: '20',
    amountUsd: 12.69,
    marketCap: '$1.18M',
    trader: 'CGL',
    age: '8m',
    type: 'sell',
    hasMessage: true,
    isLocked: true,
  },
];

type FilterType = 'dev' | 'tracked' | 'you';

export function MobileTransactionsTable() {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [_sortBy, _setSortBy] = useState<'age' | 'amount'>('age');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [makerAddress, setMakerAddress] = useState('');
  const [minUsd, setMinUsd] = useState('');
  const [maxUsd, setMaxUsd] = useState('');
  const [showFilterByTrader, setShowFilterByTrader] = useState(false);

  const filters: { id: FilterType; label: string; icon?: React.ReactNode }[] = [
    { id: 'dev', label: 'DEV', icon: <Icon name={bxFilter} size={12} /> },
    {
      id: 'tracked',
      label: 'TRACKED',
      icon: <Icon name={bxFilter} size={12} />,
    },
    { id: 'you', label: 'YOU' },
  ];

  const formatAmount = (amount: number) => {
    if (amount >= 100) return `$${amount.toFixed(1)}`;
    if (amount >= 10) return `$${amount.toFixed(2)}`;
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="flex h-full flex-col bg-[#000000]">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-v1-border-tertiary border-b px-3 py-2">
        <div className="flex items-center gap-4">
          {filters.map(filter => (
            <button
              className={`flex items-center gap-1.5 font-medium text-xs transition-colors ${
                activeFilter === filter.id
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
              key={filter.id}
              onClick={() =>
                setActiveFilter(activeFilter === filter.id ? null : filter.id)
              }
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1.5 rounded bg-v1-surface-l1 px-2 py-1 text-white/60 transition-colors hover:bg-v1-surface-l2 hover:text-white"
          data-testid="button-open-filter"
          onClick={() => setShowFilterDrawer(true)}
        >
          <Icon name={bxFilter} size={14} />
          <span className="font-medium text-xs">Filter</span>
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_80px_60px_50px] gap-2 border-v1-border-tertiary border-b px-3 py-2 font-medium text-[10px] text-white/60">
        <div className="flex items-center gap-1">
          Amount USD
          <button className="opacity-60 hover:opacity-100">
            <div className="flex h-3 w-3 items-center justify-center rounded-full border border-white/60 text-[8px]">
              ?
            </div>
          </button>
        </div>
        <div className="flex items-center gap-1">
          MC
          <Icon name={bxSort} size={10} />
        </div>
        <div>Trader</div>
        <div className="flex items-center justify-end gap-1 text-right">
          Age
          <Icon name={bxSort} size={10} />
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto">
        {DEMO_TRANSACTIONS.map(tx => (
          <div
            className="grid grid-cols-[1fr_80px_60px_50px] gap-2 border-[#0a0a0a] border-b px-3 py-2.5 transition-colors hover:bg-v1-background-primary"
            key={tx.id}
          >
            {/* Amount */}
            <div
              className={`font-mono font-semibold text-xs ${
                tx.type === 'buy' ? 'text-[#00D179]' : 'text-[#FF6B6B]'
              }`}
            >
              {formatAmount(tx.amountUsd)}
              {tx.hasWarning && (
                <span className="ml-1 inline-block flex h-3 w-3 items-center justify-center rounded bg-[#FF6B6B]/20">
                  <span className="text-[#FF6B6B] text-[8px]">!</span>
                </span>
              )}
            </div>

            {/* Market Cap */}
            <div className="font-mono text-white text-xs">{tx.marketCap}</div>

            {/* Trader */}
            <div className="flex items-center gap-1 text-white text-xs">
              {tx.trader}
              {tx.trader.endsWith('*') && (
                <span className="text-[8px] text-v1-background-brand">★</span>
              )}
            </div>

            {/* Age & Icons */}
            <div className="flex items-center justify-end gap-1.5 text-white text-xs">
              {tx.isLocked && (
                <Icon className="text-[#FF6B6B]" name={bxLock} size={12} />
              )}
              {tx.hasMessage && (
                <Icon className="text-[#00D179]" name={bxMessage} size={12} />
              )}
              {tx.age}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Drawer */}
      <Dialog
        className="bg-v1-surface-l1"
        contentClassName="flex flex-col"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        mode="drawer"
        onClose={() => setShowFilterDrawer(false)}
        open={showFilterDrawer}
      >
        {/* Maker Address */}
        <div className="px-4 pt-4 pb-3">
          <label className="mb-2 block font-medium text-sm text-white">
            Maker Address
          </label>
          <input
            className="w-full rounded-md border border-v1-border-tertiary bg-v1-surface-l1 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#5865F2] focus:outline-none"
            data-testid="input-maker-address"
            onChange={e => setMakerAddress(e.target.value)}
            placeholder="CXnxRV24ywNw3NyTmfgu7upN7VNAfRqjkdmAwNv6c1Pv"
            type="text"
            value={makerAddress}
          />
        </div>

        {/* Min/Max USD */}
        <div className="px-4 pb-3">
          <div className="mb-2 flex items-center justify-between">
            <label className="font-medium text-sm text-white">Min. USD</label>
            <button className="flex items-center gap-1 text-white/60 text-xs">
              <Icon name={bxSort} size={12} />
              <span>USD</span>
            </button>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-v1-border-tertiary bg-v1-surface-l1 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#5865F2] focus:outline-none"
              data-testid="input-min-usd"
              onChange={e => setMinUsd(e.target.value)}
              placeholder="Enter min USD"
              type="text"
              value={minUsd}
            />
            <input
              className="flex-1 rounded-md border border-v1-border-tertiary bg-v1-surface-l1 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#5865F2] focus:outline-none"
              data-testid="input-max-usd"
              onChange={e => setMaxUsd(e.target.value)}
              placeholder="Enter max USD"
              type="text"
              value={maxUsd}
            />
          </div>
        </div>

        {/* Show filter button by trader */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">
              Show filter button by trader
            </span>
            <Toggle
              data-testid="switch-filter-by-trader"
              onChange={setShowFilterByTrader}
              value={showFilterByTrader}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-3 border-v1-border-tertiary border-t px-4 py-4">
          <button
            className="flex items-center justify-center gap-2 rounded-md px-4 py-2.5 font-medium text-sm text-white transition-colors hover:bg-v1-surface-l2"
            data-testid="button-reset-filter"
            onClick={() => {
              setMakerAddress('');
              setMinUsd('');
              setMaxUsd('');
              setShowFilterByTrader(false);
            }}
          >
            <Icon name={bxRotateLeft} size={16} />
            Reset
          </button>
          <button
            className="flex-1 rounded-full bg-[#5865F2] py-2.5 font-semibold text-sm text-white transition-colors hover:bg-[#4752C4]"
            data-testid="button-apply-filter"
            onClick={() => setShowFilterDrawer(false)}
          >
            Apply
          </button>
        </div>
      </Dialog>
    </div>
  );
}
