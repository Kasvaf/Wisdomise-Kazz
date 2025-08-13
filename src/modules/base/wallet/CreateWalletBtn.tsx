import { bxPlus } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { useCreateWalletMutation, useWalletsQuery } from 'api/wallets';
import { useHasFlag } from 'api';

const MAX_WALLETS = 5;
export default function CreateWalletBtn({ className }: { className?: string }) {
  const { data: wallets } = useWalletsQuery();
  const { mutateAsync, isPending } = useCreateWalletMutation();
  const hasFlag = useHasFlag();

  const createWallet = () => {
    void mutateAsync({
      network_slug: 'solana',
      name: `Wallet #${(wallets?.count ?? 0) + 1}`,
    });
  };

  const limitReached = (wallets?.count ?? 0) >= MAX_WALLETS;

  return hasFlag('/wallets') ? (
    <Button
      size="sm"
      className={clsx(className, 'mt-3', limitReached && 'w-full')}
      variant="ghost"
      loading={isPending}
      disabled={limitReached}
      onClick={createWallet}
    >
      {limitReached ? (
        'Max Number of Wallets Reached'
      ) : (
        <>
          <Icon name={bxPlus} />
          Add Wallet
        </>
      )}
    </Button>
  ) : null;
}
