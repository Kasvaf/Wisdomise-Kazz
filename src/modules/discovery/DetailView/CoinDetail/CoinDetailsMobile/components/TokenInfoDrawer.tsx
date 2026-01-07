import {
  bxCheck,
  bxCopy,
  bxGroup,
  bxLinkExternal,
  bxRefresh,
  bxSearch,
  bxShow,
  bxsShield,
  bxTrendingUp,
} from 'boxicons-quasar';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { useCopyToClipboard } from 'utils/useCopyToClipboard';
import { useUnifiedCoinDetails } from '../../lib';

interface TokenInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function StatBox({
  label,
  value,
  color = 'text-white',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
      <span className={`font-bold text-sm ${color}`}>{value}</span>
      <span className="mt-0.5 text-[10px] text-neutral-600">{label}</span>
    </div>
  );
}

export function TokenInfoDrawer({ isOpen, onClose }: TokenInfoDrawerProps) {
  const { copyToClipboard, copied } = useCopyToClipboard();
  const { validatedData, securityData, symbol, developer } =
    useUnifiedCoinDetails();

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
      {/* Row 1: Top 10 H., Dev H., Snipers H. */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox
          color="text-v1-content-negative"
          label="Top 10 H."
          value={`${((validatedData?.top10Holding ?? 0) * 100).toFixed(2)}%`}
        />
        <StatBox
          color="text-v1-content-positive"
          label="Dev H."
          value={`${((validatedData?.devHolding ?? 0) * 100).toFixed(2)}%`}
        />
        <StatBox
          color="text-v1-content-positive"
          label="Snipers H."
          value={`${((validatedData?.snipersHolding ?? 0) * 100).toFixed(2)}%`}
        />
      </div>

      {/* Row 2: LP Burned (Insiders & Bundlers not available in API) */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox color="text-neutral-600" label="Insiders" value="N/A" />
        <StatBox color="text-neutral-600" label="Bundlers" value="N/A" />
        <StatBox
          color="text-v1-content-positive"
          label="LP Burned"
          value={securityData?.lpBurned ? '100%' : '0%'}
        />
      </div>

      {/* Row 3: Holders, Pro Traders, Dex Paid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
          <div className="flex items-center gap-1">
            <Icon className="text-white" name={bxGroup} size={14} />
            <span className="font-bold text-sm text-white">
              {(validatedData?.numberOfHolders ?? 0).toLocaleString()}
            </span>
          </div>
          <span className="mt-0.5 text-[10px] text-neutral-600">Holders</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
          <div className="flex items-center gap-1">
            <Icon className="text-neutral-600" name={bxTrendingUp} size={14} />
            <span className="font-bold text-neutral-600 text-sm">N/A</span>
          </div>
          <span className="mt-0.5 text-[10px] text-neutral-600">
            Pro Traders
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
          <div className="flex items-center gap-1">
            <Icon
              className={
                securityData?.dexPaid
                  ? 'text-v1-content-positive'
                  : 'text-neutral-600'
              }
              name={bxsShield}
              size={14}
            />
            <span
              className={`font-bold text-sm ${
                securityData?.dexPaid
                  ? 'text-v1-content-positive'
                  : 'text-neutral-600'
              }`}
            >
              {securityData?.dexPaid ? 'Paid' : 'Not Paid'}
            </span>
          </div>
          <span className="mt-0.5 text-[10px] text-neutral-600">Dex Paid</span>
        </div>
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
