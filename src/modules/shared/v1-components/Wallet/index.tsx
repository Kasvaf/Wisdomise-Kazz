import { useAllWallets } from 'api/chains/wallet';
import { bxsCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import type { FC } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { getAddressSuffix, shortenAddress } from 'utils/address';
import { ReactComponent as UserIcon } from './user.svg';

export const Wallet: FC<{
  address?: string;
  className?: string;
  mode?: 'mini' | 'address' | 'name';
}> = ({ className, address, mode = 'address' }) => {
  const trackedWallets = useTrackedWallets();
  const userWallets = useAllWallets();

  const [copy, notificationContent] = useShare('copy');
  const formatter = mode === 'mini' ? getAddressSuffix : shortenAddress;
  const shortAddress = formatter(address);

  const walletDetail = trackedWallets.find(w => w.address === address);
  const isUser = !!address && userWallets.includes(address);

  return (
    <span
      className={clsx(
        'inline-flex w-max items-center gap-2 overflow-hidden rounded-md font-mono',
        className,
      )}
    >
      {isUser && (
        <HoverTooltip title="You">
          <UserIcon className="size-4 text-v1-content-brand" />
        </HoverTooltip>
      )}
      <HoverTooltip
        title={
          <Button
            onClick={() => {
              if (address) {
                void copy(address);
              }
            }}
            size="2xs"
            variant="ghost"
          >
            <span>{shortenAddress(address, 12, 4)}</span>
            <Icon
              className="[&_svg]:!size-3 cursor-copy opacity-75"
              name={bxsCopy}
              size={6}
            />
          </Button>
        }
      >
        <div className="flex items-center gap-1">
          {walletDetail && <span>{walletDetail.emoji}</span>}
          <span>{walletDetail?.name ?? shortAddress}</span>
        </div>
      </HoverTooltip>
      {notificationContent}
    </span>
  );
};
