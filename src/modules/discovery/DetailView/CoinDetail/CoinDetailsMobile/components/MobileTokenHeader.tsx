import { bxShareAlt, bxShow, bxsShield, bxX } from 'boxicons-quasar';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import Icon from 'modules/shared/Icon';
import { TokenSocials } from 'modules/shared/TokenSocials';
import { Button } from 'modules/shared/v1-components/Button';
import { useEffect, useState } from 'react';
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
  const { symbol, createdAt, socials, meta } = useUnifiedCoinDetails();

  // Use meta.id as viewers count if available, otherwise use prop
  const viewersCount = meta?.id ?? viewers;

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
    <div className="flex items-center justify-between gap-3 bg-v1-background-primary px-3 py-2.5">
      {/* Token Icon with Platform Badge */}
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-v1-border-tertiary bg-gradient-to-br from-yellow-500 to-orange-600">
          {symbol.logo ? (
            <img
              alt={symbol.abbreviation || 'Token'}
              className="h-full w-full object-cover"
              src={symbol.logo}
            />
          ) : (
            <span className="font-bold text-lg text-white">
              {symbol.abbreviation?.[0] || '?'}
            </span>
          )}
        </div>
        {/* Platform Badge */}
        <div className="-bottom-0.5 -right-0.5 absolute flex h-5 w-5 items-center justify-center rounded-full border-2 border-v1-background-primary bg-v1-background-positive">
          <span className="font-bold text-[9px] text-white">
            {platform[0].toUpperCase()}
          </span>
        </div>
      </div>

      {/* Token Info - Center */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Token Name & Symbol */}
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <h1 className="truncate font-bold text-lg text-white leading-tight">
              {symbol.abbreviation}
            </h1>
            {/* Copy Address Button - Inline */}
            <button
              className="group flex shrink-0 items-center justify-center rounded-md p-0.5 transition-all hover:bg-v1-surface-l1 active:scale-95"
              onClick={() => copyToClipboard(symbol.contractAddress || '')}
              type="button"
            >
              {copied ? (
                <svg
                  className="h-3.5 w-3.5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="h-3.5 w-3.5 text-neutral-500 transition-colors group-hover:text-neutral-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <span className="truncate text-neutral-400 text-sm leading-tight">
            {symbol.name}
          </span>
        </div>

        {/* Meta Row: Socials, Age, Viewers */}
        <div className="flex min-w-0 items-center gap-2">
          {/* Social Icons */}
          <TokenSocials
            abbreviation={symbol.abbreviation}
            contractAddress={symbol.contractAddress}
            hideSearch={false}
            name={symbol.name}
            size="xs"
            value={socials}
          />

          {/* Age */}
          {createdAt && (
            <>
              <span className="text-neutral-700">·</span>
              <NCoinAge
                className="shrink-0 text-neutral-500 text-xs"
                imgClassName="size-3"
                inline
                value={createdAt}
              />
            </>
          )}

          {/* Viewers */}
          {viewersCount > 0 && (
            <>
              <span className="text-neutral-700">·</span>
              <div className="flex shrink-0 items-center gap-1 text-neutral-500">
                <Icon name={bxShow} size={13} />
                <span className="font-medium text-[11px]">{viewersCount}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons - Right */}
      <div className="flex shrink-0 items-center gap-1.5">
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
