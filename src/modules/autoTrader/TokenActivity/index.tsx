import { useHasFlag, useLastCandleStream, useTokenPairsQuery } from 'api';
import {
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
  WRAPPED_SOLANA_SLUG,
} from 'api/chains/constants';
import { bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import SwapSharingModal from 'modules/autoTrader/SwapSharingModal';
import { useTokenActivity } from 'modules/autoTrader/TokenActivity/useWatchTokenStream';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useState } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { Token } from 'shared/v1-components/Token';
import { formatNumber } from 'utils/numbers';
import { ReactComponent as UsdIcon } from './usd.svg';

export const BtnConvertToUsd = ({
  isUsd = true,
  onChange,
  className,
  disabled,
  size = '3xs',
}: {
  isUsd?: boolean;
  onChange: (isUsd: boolean) => void;
  className?: string;
  disabled?: boolean;
  size?: '3xs' | 'xs';
}) => {
  return (
    <Button
      className={clsx(
        className,
        'text-v1-content-primary/70',
        isUsd && '!text-v1-content-positive',
      )}
      disabled={disabled}
      fab
      onClick={() => onChange(!isUsd)}
      size={size}
      variant="ghost"
    >
      <UsdIcon className="!size-4" />
    </Button>
  );
};

export function SolanaIcon({
  className,
  size = 'xs',
  noCors,
}: {
  className?: string;
  size?: 'xs' | 'md';
  noCors?: boolean;
}) {
  return (
    <Token
      address={WRAPPED_SOLANA_CONTRACT_ADDRESS}
      autoFill
      className={className}
      icon
      link={false}
      noCors={noCors}
      size={size}
    />
  );
}

export default function TokenActivity({ mini = false }: { mini?: boolean }) {
  const { symbol } = useUnifiedCoinDetails();
  const { settings, toggleShowActivityInUsd } = useUserSettings();
  const slug = symbol.slug;
  const { data } = useTokenActivity({ slug });
  const hasFlag = useHasFlag();
  const [openShare, setOpenShare] = useState(false);

  const network = useActiveNetwork();
  const { data: pairs, isPending } = useTokenPairsQuery(slug);

  const hasSolanaPair =
    !isPending && pairs?.some(p => p.quote.slug === WRAPPED_SOLANA_SLUG);
  const showUsd = hasSolanaPair ? settings.show_activity_in_usd : true;

  const lastCandle = useLastCandleStream({
    market: 'SPOT',
    network,
    slug: symbol.slug ?? '',
    quote: WRAPPED_SOLANA_SLUG,
  });

  const lastCandleUsd = useLastCandleStream({
    market: 'SPOT',
    network,
    slug: symbol.slug ?? '',
    quote: WRAPPED_SOLANA_SLUG,
    convertToUsd: true,
  });

  const unit = showUsd ? '$' : <SolanaIcon />;

  const bought = Number(data?.totalBought ?? '0');
  const boughtUsd = Number(data?.totalBoughtUsd ?? '0');

  const sold = Number(data?.totalSold ?? '0');
  const soldUsd = Number(data?.totalSoldUsd ?? '0');

  const balance = Number(data?.balance ?? '0');
  const hold = balance * Number(lastCandle.data?.candle?.close ?? '0');
  const holdUsd = balance * Number(lastCandleUsd.data?.candle?.close ?? '0');

  const pnl = sold + hold - bought;
  const pnlUsd = soldUsd + holdUsd - boughtUsd;

  const pnlPercent = bought === 0 ? 0 : (pnl / bought) * 100;
  const pnlUsdPercent = boughtUsd === 0 ? 0 : (pnlUsd / boughtUsd) * 100;
  const pnlSign = pnl >= 0 ? '+' : '-';

  const formatter = (value?: string | number) => {
    return formatNumber(Number(value ?? '0'), {
      decimalLength: 2,
      minifyDecimalRepeats: true,
      compactInteger: false,
      separateByComma: false,
    });
  };

  if (!hasFlag('/swap-activity')) return null;

  return (
    <div
      className={clsx(
        mini
          ? 'cursor-pointer border-white/5 border-t'
          : 'border-white/10 border-b',
      )}
      onClick={() => mini && toggleShowActivityInUsd()}
    >
      <div
        className={clsx(
          !mini && 'my-3 rounded-xl bg-v1-surface-l1 p-3',
          'px-3 text-xs',
        )}
      >
        {!mini && (
          <div className="mb-4 flex items-center justify-between">
            Your Activity on This Token
            {pnl !== 0 && (
              <Button
                className="text-v1-content-primary/70"
                fab
                onClick={() => setOpenShare(true)}
                size="2xs"
                variant="ghost"
              >
                <Icon className="[&>svg]:!size-4" name={bxShareAlt} />
              </Button>
            )}
          </div>
        )}
        <div className={clsx('flex gap-2', mini && 'items-center')}>
          <div className="grow">
            {!mini && <p className="mb-2 text-v1-content-secondary">Bought</p>}
            <div
              className={clsx(
                'flex gap-1 text-v1-content-positive',
                mini && 'justify-center',
              )}
            >
              {unit}
              {formatter(showUsd ? boughtUsd : bought)}
            </div>
          </div>
          <div className="h-7 border-white/5 border-r" />
          <div className="grow">
            {!mini && <p className="mb-2 text-v1-content-secondary">Sold</p>}
            <div
              className={clsx(
                'flex gap-1 text-v1-content-negative',
                mini && 'justify-center',
              )}
            >
              {unit}
              {formatter(showUsd ? soldUsd : sold)}
            </div>
          </div>
          <div className="h-7 border-white/5 border-r" />
          <div className="grow">
            {!mini && <p className="mb-2 text-v1-content-secondary">Holding</p>}
            <div className={clsx('flex gap-1', mini && 'justify-center')}>
              {unit}
              {formatter(showUsd ? holdUsd : hold)}
            </div>
          </div>
          <div className="h-7 border-white/5 border-r" />
          <div className="grow">
            {!mini && (
              <div className="relative mb-2 flex items-center gap-1">
                <span className="text-v1-content-secondary">PNL</span>
                <BtnConvertToUsd
                  className="!absolute right-0"
                  disabled={!hasSolanaPair}
                  isUsd={showUsd}
                  onChange={toggleShowActivityInUsd}
                />
              </div>
            )}
            <div
              className={
                pnlSign === '+'
                  ? 'text-v1-content-positive'
                  : 'text-v1-content-negative'
              }
            >
              {showUsd ? (
                <span
                  className={clsx(
                    'flex items-center gap-1',
                    mini && 'justify-center',
                  )}
                >
                  {pnlSign}
                  {unit}
                  {`${formatter(Math.abs(pnlUsd))} (${pnlSign}${Math.abs(
                    pnlUsdPercent,
                  ).toFixed(0)}%)`}
                </span>
              ) : (
                <span
                  className={clsx(
                    'flex items-start gap-1',
                    mini && 'justify-center',
                  )}
                >
                  {unit}
                  {pnlSign}
                  {`${formatter(Math.abs(pnl))} (${pnlSign}${Math.abs(
                    pnlPercent,
                  ).toFixed(0)}%)`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <SwapSharingModal
        bought={bought}
        boughtUsd={boughtUsd}
        onClose={() => setOpenShare(false)}
        open={openShare}
        pnl={pnl}
        pnlPercent={pnlPercent}
        pnlUsd={pnlUsd}
        pnlUsdPercent={pnlUsdPercent}
        slug={slug}
        sold={sold}
        soldUsd={soldUsd}
      />
    </div>
  );
}
