import { bxsCopy, bxTrophy, bxUser } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { ReactComponent as DevIcon } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight/dev_holding.svg';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import type { FC } from 'react';
import { useUserWallets } from 'services/chains/wallet';
import { useKolWallets } from 'services/rest/kol';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { getAddressSuffix, shortenAddress } from 'utils/address';

export const Wallet: FC<{
  address?: string;
  className?: string;
  mode?: 'mini' | 'address' | 'name';
}> = ({ className, address, mode = 'address' }) => {
  const trackedWallets = useTrackedWallets();
  const userWallets = useUserWallets();
  const { data: kolWallets } = useKolWallets({});
  const { developer } = useUnifiedCoinDetails();

  const [copy, notificationContent] = useShare('copy');
  const formatter = mode === 'mini' ? getAddressSuffix : shortenAddress;
  const shortAddress = formatter(address);

  const walletDetail = trackedWallets.find(w => w.address === address);
  const kolWalletDetail = kolWallets?.find(w => w.wallet_address === address);
  const isUser = !!address && userWallets.includes(address);
  const isDev = !!address && developer?.address === address;

  return (
    <span
      className={clsx(
        'inline-flex w-max items-center gap-2 overflow-hidden rounded-md font-mono',
        className,
      )}
    >
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
        {isUser
          ? 'You'
          : walletDetail
            ? walletDetail.name
            : kolWalletDetail
              ? kolWalletDetail.name
              : shortAddress}
      </HoverTooltip>
      <HoverTooltip
        title={
          isUser
            ? 'You'
            : walletDetail
              ? 'Tracked'
              : isDev
                ? 'Dev'
                : kolWalletDetail
                  ? 'KOL'
                  : ''
        }
      >
        {isUser ? (
          <Icon
            className="text-v1-content-brand [&>svg]:size-3"
            name={bxUser}
          />
        ) : walletDetail ? (
          walletDetail.emoji
        ) : isDev ? (
          <DevIcon className="size-3 text-v1-content-brand" />
        ) : kolWalletDetail ? (
          <Icon
            className="text-v1-content-brand [&>svg]:size-3"
            name={bxTrophy}
          />
        ) : null}
      </HoverTooltip>
      {notificationContent}
    </span>
  );
};
