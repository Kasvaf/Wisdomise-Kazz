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

interface TokenInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tokenData?: {
    name: string;
    ticker: string;
  };
}

const mockTokenInfo = {
  top10Holders: '18.26%',
  devHolding: '4.19%',
  snipersHolding: '4.19%',
  insiders: '17.79%',
  bundlers: '0.86%',
  lpBurned: '100%',
  holders: 3912,
  proTraders: 301,
  dexPaid: true,
  contractAddress: '8y45AJzCUBSZL1UDFQRzCKovQBLQFudBrpP...',
  devAddress: 'CXnxRV24ywNw3NyTmfgu7upN7VNA...',
  coinbase: { name: 'Coinbase', amount: '0.33' },
  reusedImages: [
    {
      name: 'BlackWhale',
      fullName: 'The Black Whale',
      lastTx: '6d',
      value: '$4.89K',
    },
    {
      name: 'BlackWhale',
      fullName: 'The Black Whale',
      lastTx: '6d',
      value: '$88.6K',
    },
    {
      name: 'BlackWhale',
      fullName: 'The Black Whale',
      lastTx: '6d',
      value: '$12.3K',
    },
  ],
};

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

export function TokenInfoDrawer({
  isOpen,
  onClose,
  tokenData,
}: TokenInfoDrawerProps) {
  const { copyToClipboard, copied } = useCopyToClipboard();

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
          value={mockTokenInfo.top10Holders}
        />
        <StatBox
          color="text-v1-content-positive"
          label="Dev H."
          value={mockTokenInfo.devHolding}
        />
        <StatBox
          color="text-v1-content-positive"
          label="Snipers H."
          value={mockTokenInfo.snipersHolding}
        />
      </div>

      {/* Row 2: Insiders, Bundlers, LP Burned */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox
          color="text-v1-content-negative"
          label="Insiders"
          value={mockTokenInfo.insiders}
        />
        <StatBox
          color="text-v1-content-positive"
          label="Bundlers"
          value={mockTokenInfo.bundlers}
        />
        <StatBox
          color="text-v1-content-positive"
          label="LP Burned"
          value={mockTokenInfo.lpBurned}
        />
      </div>

      {/* Row 3: Holders, Pro Traders, Dex Paid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
          <div className="flex items-center gap-1">
            <Icon className="text-white" name={bxGroup} size={14} />
            <span className="font-bold text-sm text-white">
              {mockTokenInfo.holders.toLocaleString()}
            </span>
          </div>
          <span className="mt-0.5 text-[10px] text-neutral-600">Holders</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
          <div className="flex items-center gap-1">
            <Icon className="text-white" name={bxTrendingUp} size={14} />
            <span className="font-bold text-sm text-white">
              {mockTokenInfo.proTraders}
            </span>
          </div>
          <span className="mt-0.5 text-[10px] text-neutral-600">
            Pro Traders
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
          <div className="flex items-center gap-1">
            <Icon
              className="text-v1-content-positive"
              name={bxsShield}
              size={14}
            />
            <span className="font-bold text-sm text-v1-content-positive">
              Paid
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
              {mockTokenInfo.contractAddress}
            </span>
          </div>
          <div className="ml-2 flex shrink-0 items-center gap-1">
            <Button
              className="text-neutral-600"
              fab={true}
              onClick={() => copyToClipboard(mockTokenInfo.contractAddress)}
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
              {mockTokenInfo.devAddress}
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

      {/* Coinbase Info */}
      <div className="rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
              <span className="font-bold text-[8px] text-white">C</span>
            </div>
            <span className="font-medium text-white text-xs">
              {mockTokenInfo.coinbase.name}
            </span>
            <span className="text-neutral-600 text-xs">=</span>
            <span className="font-mono text-white text-xs">
              {mockTokenInfo.coinbase.amount}
            </span>
          </div>
          <span className="rounded bg-v1-surface-l2 px-2 py-0.5 text-[10px] text-neutral-600">
            6d
          </span>
        </div>
      </div>

      {/* Reused Image Tokens */}
      <div>
        <div className="mb-2 text-center text-[10px] text-neutral-600 uppercase tracking-wider">
          Reused Image Tokens ({mockTokenInfo.reusedImages.length})
        </div>
        <div className="space-y-2">
          {mockTokenInfo.reusedImages.map((token, idx) => (
            <div
              className="flex items-center gap-3 rounded-lg border border-v1-border-tertiary bg-v1-surface-l1 p-3"
              key={idx}
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-900">
                <span className="font-bold text-white text-xs">
                  {token.name[0]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">
                    {token.name}
                  </span>
                  <span className="truncate text-neutral-600 text-xs">
                    {token.fullName}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-600">
                  Last TX: {token.lastTx}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-neutral-600">
                  {token.lastTx}
                </span>
                <span className="font-mono text-v1-content-positive text-xs">
                  {token.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
