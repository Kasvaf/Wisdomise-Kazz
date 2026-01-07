import {
  bxCheck,
  bxCopy,
  bxLinkExternal,
  bxRefresh,
  bxSearch,
  bxShow,
} from 'boxicons-quasar';
import {
  useBundleHolding,
  useDevHolding,
  useDexPaid,
  useHoldersNumber,
  useLpBurned,
  useRisks,
  useSniperHolding,
  useTop10Holding,
} from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight/useTokenInsight';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { useMemo } from 'react';
import { useCopyToClipboard } from 'utils/useCopyToClipboard';
import { useUnifiedCoinDetails } from '../../lib';

interface TokenInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TokenInfoDrawer({ isOpen, onClose }: TokenInfoDrawerProps) {
  const { copyToClipboard, copied } = useCopyToClipboard();
  const { validatedData, securityData, symbol, developer, risks } =
    useUnifiedCoinDetails();

  // Use the same hooks as NCoinTokenInsight for consistent data formatting
  const top10Holding = useTop10Holding(validatedData?.top10Holding);
  const devHolding = useDevHolding(validatedData?.devHolding);
  const sniperHolding = useSniperHolding(validatedData?.snipersHolding);
  const bundleHolding = useBundleHolding(validatedData?.boundleHolding);
  const lpBurned = useLpBurned(securityData?.lpBurned);
  const dexPaid = useDexPaid(securityData?.dexPaid);
  const risksStat = useRisks(risks ?? undefined);
  const holders = useHoldersNumber(validatedData?.numberOfHolders);

  const insights = useMemo(
    () => [
      top10Holding,
      devHolding,
      sniperHolding,
      bundleHolding,
      lpBurned,
      dexPaid,
      risksStat,
      holders,
    ],
    [
      top10Holding,
      devHolding,
      sniperHolding,
      bundleHolding,
      lpBurned,
      dexPaid,
      risksStat,
      holders,
    ],
  );

  const header = (
    <div className="flex w-full items-center justify-between">
      <span className="font-bold text-base text-white">Token Info</span>
      <Button className="text-neutral-600" fab={true} size="xs" variant="ghost">
        <Icon name={bxRefresh} size={16} />
      </Button>
    </div>
  );

  return (
    <Dialog
      className="max-h-[85vh] bg-v1-background-primary"
      contentClassName="overflow-y-auto px-4 py-4 space-y-4"
      drawerConfig={{ position: 'bottom', closeButton: true }}
      header={header}
      mode="drawer"
      onClose={onClose}
      open={isOpen}
    >
      {/* Token Insights Grid - Using same hooks as NCoinTokenInsight */}
      <div className="grid grid-cols-3 gap-2">
        {insights.map(item => (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3"
            key={item.title}
          >
            <div className="flex items-center gap-1">
              {'icon' in item && (
                <item.icon
                  className={
                    item.color === 'green'
                      ? 'text-v1-content-positive'
                      : item.color === 'red'
                        ? 'text-v1-content-negative'
                        : 'text-neutral-600'
                  }
                />
              )}
              <span
                className={`font-bold text-sm ${
                  item.color === 'green'
                    ? 'text-v1-content-positive'
                    : item.color === 'red'
                      ? 'text-v1-content-negative'
                      : 'text-white'
                }`}
              >
                {item.value}
              </span>
            </div>
            <span className="mt-0.5 text-[10px] text-neutral-600">
              {item.title}
            </span>
          </div>
        ))}
      </div>

      {/* Contract Address */}
      <div className="rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="shrink-0 text-[10px] text-neutral-600">CA:</span>
            <span className="truncate font-mono text-white text-xs">
              {symbol.contractAddress ?? 'N/A'}
            </span>
          </div>
          <div className="ml-2 flex shrink-0 items-center gap-1">
            <Button
              className="text-neutral-600"
              fab={true}
              onClick={() => copyToClipboard(symbol.contractAddress ?? '')}
              size="xs"
              variant="ghost"
            >
              {copied ? (
                <Icon
                  className="text-v1-content-positive"
                  name={bxCheck}
                  size={14}
                />
              ) : (
                <Icon name={bxCopy} size={14} />
              )}
            </Button>
            <Button
              className="text-neutral-600"
              fab={true}
              size="xs"
              variant="ghost"
            >
              <Icon name={bxLinkExternal} size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Dev Address */}
      <div className="rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="shrink-0 text-[10px] text-neutral-600">DA:</span>
            <span className="truncate font-mono text-white text-xs">
              {developer?.address ?? 'N/A'}
            </span>
          </div>
          <div className="ml-2 flex shrink-0 items-center gap-1">
            <Button
              className="text-neutral-600"
              fab={true}
              size="xs"
              variant="ghost"
            >
              <Icon name={bxShow} size={14} />
            </Button>
            <Button
              className="text-neutral-600"
              fab={true}
              size="xs"
              variant="ghost"
            >
              <Icon name={bxSearch} size={14} />
            </Button>
            <Button
              className="text-neutral-600"
              fab={true}
              size="xs"
              variant="ghost"
            >
              <Icon name={bxLinkExternal} size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Coinbase Info - Hidden until API provides this data */}
      {/* Reused Image Tokens - Hidden until API provides this data */}
    </Dialog>
  );
}
