import { type FC, useState } from 'react';
import { Button } from 'shared/v1-components/Button';
import { ResizableSides } from 'shared/v1-components/ResizableSides';
import AddWalletDialog from './AddWalletDialog';
import WalletsManager from './WalletsManager';
import WalletsSwaps from './WalletsSwaps';

export const WalletTracker: FC<{
  focus?: boolean;
  expanded?: boolean;
}> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col justify-start pt-3">
      <Button
        className="ml-3 w-max shrink-0"
        onClick={() => setOpen(true)}
        size="md"
        variant="outline"
      >
        Add Wallets
      </Button>
      <AddWalletDialog onClose={() => setOpen(false)} open={open} />
      <hr className="my-3 border-white/10" />
      <ResizableSides className={['h-full min-h-8', 'min-h-8']} direction="row">
        <WalletsSwaps />
        <WalletsManager />
      </ResizableSides>
    </div>
  );
};
