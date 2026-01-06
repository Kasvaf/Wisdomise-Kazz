import {
  bxCopy,
  bxGrid,
  bxLink,
  bxSearch,
  bxSend,
  bxShareAlt,
  bxShow,
  bxsShield,
  bxWorld,
  bxX,
} from 'boxicons-quasar';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'utils/useCopyToClipboard';

interface MobileTokenHeaderProps {
  name: string;
  ticker: string;
  icon?: string;
  age?: string;
  viewers?: number;
  contractAddress?: string;
  platform?: string;
  onInfoClick?: () => void;
}

export function MobileTokenHeader({
  name = '26',
  ticker = '26',
  icon,
  age = '17h',
  viewers = 6,
  contractAddress = 'BjMK...HjGs',
  platform = 'pump',
  onInfoClick,
}: MobileTokenHeaderProps) {
  const { copyToClipboard, copied } = useCopyToClipboard();
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/token/solana/${ticker}`;
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
    <div className="flex flex-col bg-v1-background-primary px-3 py-1.5">
      {/* Row 1: Token Info & Actions */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Token Icon + Info */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {/* Token Icon with Platform Badge */}
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-v1-border-tertiary bg-gradient-to-br from-yellow-500 to-orange-600">
              {icon ? (
                <img
                  alt={ticker}
                  className="h-full w-full object-cover"
                  src={icon}
                />
              ) : (
                <span className="font-bold text-lg text-white">
                  {ticker[0]}
                </span>
              )}
            </div>
            {/* Platform Badge */}
            <div className="-bottom-0.5 -left-0.5 absolute flex h-5 w-5 items-center justify-center rounded-full border-2 border-v1-background-primary bg-[#00D179]">
              <span className="font-bold text-[8px] text-white">
                {platform[0].toUpperCase()}
              </span>
            </div>
          </div>

          {/* Token Name & Details */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {/* Name Row */}
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="max-w-[80px] truncate font-bold text-sm text-white">
                {ticker}
              </span>
              <span className="min-w-0 max-w-[120px] flex-1 truncate text-neutral-500 text-sm">
                {name}
              </span>
              <Button
                className="shrink-0"
                fab={true}
                onClick={() => copyToClipboard(contractAddress || '')}
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
              <span className="shrink-0 text-neutral-600 text-xs">{age}</span>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-0.5">
              <Button fab={true} size="3xs" variant="ghost">
                <Icon className="text-neutral-600" name={bxLink} size={14} />
              </Button>
              <Button fab={true} size="3xs" variant="ghost">
                <Icon className="text-neutral-600" name={bxGrid} size={14} />
              </Button>
              <Button fab={true} size="3xs" variant="ghost">
                <Icon className="text-neutral-600" name={bxWorld} size={14} />
              </Button>
              <Button fab={true} size="3xs" variant="ghost">
                <Icon className="text-neutral-600" name={bxSend} size={14} />
              </Button>
              <Button fab={true} size="3xs" variant="ghost">
                <Icon className="text-neutral-600" name={bxSearch} size={14} />
              </Button>
              <div className="ml-1 flex items-center gap-0.5 text-neutral-600">
                <Icon name={bxShow} size={14} />
                <span className="font-medium text-[10px]">{viewers}</span>
              </div>
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
            <Icon className="text-[#00D179]" name={bxsShield} size={16} />
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
