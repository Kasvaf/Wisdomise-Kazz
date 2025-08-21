import { useHasFlag } from 'api';
import { useCreateWalletMutation, useWalletsQuery } from 'api/wallets';
import { bxPlus } from 'boxicons-quasar';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

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
      className={clsx(className, 'mt-3', limitReached && 'w-full')}
      disabled={limitReached}
      loading={isPending}
      onClick={createWallet}
      size="sm"
      variant="ghost"
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
