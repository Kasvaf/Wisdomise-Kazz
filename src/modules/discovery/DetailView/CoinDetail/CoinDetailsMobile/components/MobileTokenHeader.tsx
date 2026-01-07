import { bxCopy, bxShareAlt, bxShow, bxsShield, bxX } from 'boxicons-quasar';
import { doesNCoinHaveLargeTxns } from 'modules/discovery/ListView/NetworkRadar/lib';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { NCoinBCurve } from 'modules/discovery/ListView/NetworkRadar/NCoinList';
import Icon from 'modules/shared/Icon';
import { TokenSocials } from 'modules/shared/TokenSocials';
import { Button } from 'modules/shared/v1-components/Button';
import { useEffect, useState } from 'react';
import { useTokenUpdateStream } from 'services/grpc/tokenUpdate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useCopyToClipboard } from 'utils/useCopyToClipboard';
import { useUnifiedCoinDetails } from '../../lib';

interface MobileTokenHeaderProps {
  viewers?: number;
  platform?: string;
  onInfoClick?: () => void;
}

export function MobileTokenHeader({
  viewers = 0,
  platform = 'pump',
  onInfoClick,
}: MobileTokenHeaderProps) {
  const { copyToClipboard, copied } = useCopyToClipboard();
  const [showShareToast, setShowShareToast] = useState(false);
  const { symbol, marketData, createdAt, socials } = useUnifiedCoinDetails();

  const { data: tokenUpdate } = useTokenUpdateStream({
    network: 'solana',
    tokenAddress: symbol.contractAddress ?? undefined,
    resolution: 'all-time',
  });

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/token/solana/${symbol.abbreviation}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareToast(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (showShareToast) {
      const timer = setTimeout(() => setShowShareToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showShareToast]);

  return (
    <div className="flex flex-col bg-v1-background-primary px-3 py-2">
      {/* Row 1: Token Info & Actions */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Token Icon + Info */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* Token Icon with Platform Badge */}
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-v1-border-tertiary bg-gradient-to-br from-yellow-500 to-orange-600">
              {symbol.logo ? (
                <img
                  alt={symbol.abbreviation || 'Token'}
                  className="h-full w-full object-cover"
                  src={symbol.logo}
                />
              ) : (
                <span className="font-bold text-base text-white">
                  {symbol.abbreviation?.[0] || '?'}
                </span>
              )}
            </div>
            {/* Platform Badge */}
            <div className="-bottom-0.5 -left-0.5 absolute flex h-5 w-5 items-center justify-center rounded-full border-2 border-v1-background-primary bg-v1-background-positive">
              <span className="font-bold text-[8px] text-white">
                {platform[0].toUpperCase()}
              </span>
            </div>
          </div>

          {/* Token Name & Details */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {/* Name Row */}
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="max-w-[80px] truncate font-bold text-base text-white">
                {symbol.abbreviation}
              </span>
              <span className="min-w-0 max-w-[120px] flex-1 truncate text-base text-neutral-500">
                {symbol.name}
              </span>
              <Button
                className="shrink-0"
                fab={true}
                onClick={() => copyToClipboard(symbol.contractAddress || '')}
                size="3xs"
                variant="ghost"
              >
                {copied ? (
                  <span className="text-[10px] text-v1-background-brand">
                    ✓
                  </span>
                ) : (
                  <Icon className="text-neutral-600" name={bxCopy} size={14} />
                )}
              </Button>
              {createdAt && (
                <>
                  <span className="text-neutral-600">·</span>
                  <NCoinAge
                    className="shrink-0 text-neutral-600 text-xs"
                    imgClassName="size-3"
                    inline
                    value={createdAt}
                  />
                </>
              )}
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-0.5">
              <TokenSocials
                abbreviation={symbol.abbreviation}
                contractAddress={symbol.contractAddress}
                hideSearch={false}
                name={symbol.name}
                size="xs"
                value={socials}
              />
              <div className="ml-1 flex items-center gap-0.5 text-neutral-600">
                <Icon name={bxShow} size={14} />
                <span className="font-medium text-[10px]">{viewers}</span>
              </div>
            </div>

            {/* 2x2 Metrics Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-0.5">
              {/* Market Cap */}
              <div className="flex flex-col">
                <span className="text-v1-content-secondary text-xs">
                  Market Cap
                </span>
                <ReadableNumber
                  className="font-medium text-sm"
                  format={{ decimalLength: 1 }}
                  label="$"
                  popup="never"
                  value={marketData.marketCap}
                />
              </div>

              {/* TXNS */}
              <div className="flex flex-col">
                <span className="text-v1-content-secondary text-xs">
                  TXNS
                  {doesNCoinHaveLargeTxns({
                    totalNumBuys: marketData.totalNumBuys24h ?? 0,
                    totalNumSells: marketData.totalNumSells24h ?? 0,
                  })
                    ? ' 🔥'
                    : ''}
                </span>
                <NCoinBuySell
                  className="text-sm"
                  imgClassName="size-3"
                  value={{
                    buys: tokenUpdate?.numBuys ?? 0,
                    sells: tokenUpdate?.numSells ?? 0,
                  }}
                />
              </div>

              {/* Volume 24h */}
              <div className="flex flex-col">
                <span className="text-v1-content-secondary text-xs">
                  Volume 24h
                </span>
                <ReadableNumber
                  className="font-medium text-sm"
                  format={{ decimalLength: 1 }}
                  label="$"
                  popup="never"
                  value={marketData.volume24h}
                />
              </div>

              {/* Bonding Curve - Only show if <100% */}
              {marketData.boundingCurve !== null &&
                marketData.boundingCurve < 1 && (
                  <div className="flex flex-col">
                    <span className="text-v1-content-secondary text-xs">
                      Bonding Curve
                    </span>
                    <NCoinBCurve
                      className="text-sm"
                      value={marketData.boundingCurve}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex min-w-0 items-center gap-1.5">
          <Button
            className="border border-v1-border-tertiary"
            data-testid="button-token-info"
            fab={true}
            onClick={onInfoClick}
            size="md"
            surface={0}
            variant="outline"
          >
            <Icon
              className="text-v1-content-positive"
              name={bxsShield}
              size={16}
            />
          </Button>
          <Button
            className="border border-v1-border-tertiary"
            data-testid="button-share"
            fab={true}
            onClick={handleShare}
            size="md"
            surface={0}
            variant="outline"
          >
            <Icon className="text-neutral-600" name={bxShareAlt} size={16} />
          </Button>
        </div>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="-translate-x-1/2 fixed top-4 left-1/2 z-50 flex items-center gap-3 rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 px-4 py-3 shadow-lg">
          <Icon className="text-neutral-600" name={bxShareAlt} size={16} />
          <span className="text-sm text-white">Link copied to clipboard</span>
          <Button
            className="text-neutral-600"
            fab={true}
            onClick={() => setShowShareToast(false)}
            size="3xs"
            variant="ghost"
          >
            <Icon name={bxX} size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
