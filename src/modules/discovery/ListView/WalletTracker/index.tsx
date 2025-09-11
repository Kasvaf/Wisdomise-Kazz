import AddWalletDialog from 'modules/discovery/ListView/WalletTracker/AddWallet';
import WalletManager from 'modules/discovery/ListView/WalletTracker/WalletManager';
import WalletsSwaps from 'modules/discovery/ListView/WalletTracker/WalletsSwaps';
import { type FC, useState } from 'react';
import { Button } from 'shared/v1-components/Button';

export const WalletTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col justify-start p-3">
      <Button
        className="w-max shrink-0"
        onClick={() => setOpen(true)}
        size="md"
        variant="outline"
      >
        Add Wallet
      </Button>
      <AddWalletDialog onClose={() => setOpen(false)} open={open} />
      <hr className="my-3 border-white/10" />
      <p className="mb-3 text-sm">Live Trades</p>
      <WalletsSwaps />
      <WalletManager className="mt-auto" />
    </div>
  );
};
