import { bxArrowToRight, bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import SwapSharingModal from 'modules/autoTrader/SwapSharingModal';
import { useTokenActivity } from 'modules/autoTrader/TokenActivity/useWatchTokenStream';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useState } from 'react';
import {
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
  WRAPPED_SOLANA_SLUG,
} from 'services/chains/constants';
import { WatchEventType } from 'services/grpc/proto/wealth_manager';
import { useHasFlag, useTokenPairsQuery } from 'services/rest';
import { useTokenInfo } from 'services/rest/token-info';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
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
  size?: ButtonSize;
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
  size?: 'xs' | 'sm' | 'md';
  noCors?: boolean;
}) {
  return (
    <Token
      address={WRAPPED_SOLANA_CONTRACT_ADDRESS}
      autoFill
      className={clsx('!w-3 [&_img]:!size-3', className)}
      icon
      link={false}
      noCors={noCors}
      size={size}
    />
  );
}

export default function TokenActivity({ mini = false }: { mini?: boolean }) {
  const [showLastPosition, setShowLastPosition] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const { symbol } = useUnifiedCoinDetails();
  const { settings, toggleShowActivityInUsd } = useUserSettings();
  const slug = symbol.slug;
  const {
    bought,
    boughtUsd,
    sold,
    soldUsd,
    balance,
    hold,
    holdUsd,
    pnl,
    pnlUsd,
    pnlPercent,
    pnlUsdPercent,
    pnlSign,
  } = useTokenActivity({
    slug,
    type: showLastPosition
      ? WatchEventType.SWAP_POSITION_UPDATE
      : WatchEventType.TRADE_ACTIVITY_UPDATE,
  });

  const hasFlag = useHasFlag();
  const [openShare, setOpenShare] = useState(false);
  const { data: tokenInfo } = useTokenInfo({ slug });

  const { data: pairs, isPending } = useTokenPairsQuery(slug);

  const hasSolanaPair =
    !isPending && pairs?.some(p => p.quote.slug === WRAPPED_SOLANA_SLUG);
  const showUsd = hasSolanaPair ? settings.show_activity_in_usd : true;

  const unit = showUsd ? '$' : <SolanaIcon />;

  const formatter = (value?: string | number) => {
    return formatNumber(Number(value ?? '0'), {
      decimalLength: 2,
      minifyDecimalRepeats: true,
      compactInteger: true,
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
          <div className="mb-4 flex items-center">
            <span className="mr-auto">Your Activity on This Token</span>
            {pnl !== 0 && (
              <HoverTooltip title="Share Pnl">
                <Button
                  className="text-v1-content-primary/70"
                  fab
                  onClick={() => setOpenShare(true)}
                  size="2xs"
                  variant="ghost"
                >
                  <Icon className="[&>svg]:!size-4" name={bxShareAlt} />
                </Button>
              </HoverTooltip>
            )}
            <HoverTooltip
              title={
                showLastPosition
                  ? 'Show Total Activity'
                  : 'Show Last Position Activity'
              }
            >
              <Button
                className={clsx(
                  'text-v1-content-primary/70',
                  showLastPosition && '!text-v1-content-positive',
                )}
                fab
                onClick={() => setShowLastPosition(prev => !prev)}
                size="2xs"
                variant="ghost"
              >
                <Icon className="[&>svg]:!size-5" name={bxArrowToRight} />
              </Button>
            </HoverTooltip>
          </div>
        )}
        <div className={clsx('flex gap-1', mini && 'items-center')}>
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
          <div
            className="grow"
            onMouseEnter={() => setShowBalance(true)}
            onMouseLeave={() => setShowBalance(false)}
          >
            {!mini && <p className="mb-2 text-v1-content-secondary">Holding</p>}
            <div className={clsx('flex gap-1', mini && 'justify-center')}>
              {!showBalance && unit}
              {formatter(showBalance ? balance : showUsd ? holdUsd : hold)}
              {showBalance && ` ${tokenInfo?.symbol?.slice(0, 3)}`}
            </div>
          </div>
          <div className="h-7 border-white/5 border-r" />
          <div className="grow">
            {!mini && (
              <div className="relative mb-2 flex items-center gap-1">
                <span className="text-v1-content-secondary">PNL</span>
                <BtnConvertToUsd
                  className="!absolute left-6"
                  disabled={!hasSolanaPair}
                  isUsd={showUsd}
                  onChange={toggleShowActivityInUsd}
                  size="2xs"
                />
              </div>
            )}
            <div
              className={
                pnlSign === '+'
                  ? 'text-v1-background-brand'
                  : 'text-v1-content-negative'
              }
            >
              {showUsd ? (
                <span
                  className={clsx(
                    'flex shrink-0 items-center gap-1',
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
                    'flex shrink-0 items-start gap-1',
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
