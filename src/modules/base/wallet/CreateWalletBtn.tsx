import { bxPlus } from 'boxicons-quasar';
import { clsx } from 'clsx';
import VipRedirectButton from 'shared/AccessShield/VipBanner/VipRedirectButton';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { useCreateWalletMutation, useWalletsQuery } from 'api/wallets';
import { useSubscription } from 'api';

export default function CreateWalletBtn({ className }: { className?: string }) {
  const { data: wallets } = useWalletsQuery();
  const { mutateAsync, isPending } = useCreateWalletMutation();
  const { group } = useSubscription();

  const createWallet = () => {
    void mutateAsync({
      network_slug: 'solana',
      name: `Wallet ${(wallets?.count ?? 0) + 1}`,
    });
  };

  const firstLimitReached =
    group === 'free' && (wallets?.results?.length ?? 0) >= 5;
  const secondLimitReached = (wallets?.results?.length ?? 0) >= 10;

  return firstLimitReached ? (
    <VipRedirectButton className="mt-3" label="Join Wise Club to Add More" />
  ) : (
    <Button
      className={clsx(
        className,
        !firstLimitReached && 'bg-transparent',
        secondLimitReached && 'w-full',
      )}
      variant={firstLimitReached ? 'pro' : 'ghost'}
      loading={isPending}
      disabled={secondLimitReached}
      onClick={createWallet}
    >
      {secondLimitReached ? (
        'Max Number of Wallets Reached'
      ) : (
        <>
          <Icon name={bxPlus} />
          Add Wallet
        </>
      )}
    </Button>
  );
}
