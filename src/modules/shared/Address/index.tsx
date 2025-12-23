import { bxDroplet, bxsCopy, bxTrophy, bxUser } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { ReactComponent as DevIcon } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight/dev_holding.svg';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { type FC, useMemo } from 'react';
import { useUserWallets } from 'services/chains/wallet';
import { useTokenReview } from 'services/rest/discovery';
import { useKolWallets } from 'services/rest/kol';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { getAddressSuffix, shortenAddress } from 'utils/address';

export const Address: FC<{
  value?: string;
  className?: string;
  mode?: 'mini' | 'address' | 'name';
}> = ({ className, value, mode = 'address' }) => {
  const { developer, symbol } = useUnifiedCoinDetails();

  const trackedWallets = useTrackedWallets();
  const userWallets = useUserWallets();
  const { data: kolWallets } = useKolWallets({});

  const tokenReview = useTokenReview({ slug: symbol.slug });
  const pools = tokenReview.data?.symbol_pools ?? [];
  const isPool = useMemo(
    () => pools.map(p => p.address).includes(value),
    [pools, value],
  );

  const [copy, notificationContent] = useShare('copy');
  const formatter = mode === 'mini' ? getAddressSuffix : shortenAddress;
  const shortAddress = formatter(value);

  const walletDetail = useMemo(
    () => trackedWallets.find(w => w.address === value),
    [trackedWallets, value],
  );
  const kolWalletDetail = useMemo(
    () => kolWallets?.find(w => w.wallet_address === value),
    [kolWallets, value],
  );
  const isUser = useMemo(
    () => !!value && userWallets.includes(value),
    [userWallets, value],
  );
  const isDev = !!value && developer?.address === value;

  return (
    <span
      className={clsx(
        'inline-flex w-max items-center gap-1 overflow-hidden rounded-md font-mono',
        className,
      )}
    >
      <HoverTooltip
        title={
          <Button
            onClick={() => {
              if (value) {
                void copy(value);
              }
            }}
            size="2xs"
            variant="ghost"
          >
            <span>{shortenAddress(value, 12, 4)}</span>
            <Icon
              className="[&_svg]:!size-3 cursor-copy opacity-75"
              name={bxsCopy}
              size={6}
            />
          </Button>
        }
      >
        {isUser ? (
          'You'
        ) : walletDetail ? (
          <span>
            {walletDetail.emoji} {walletDetail.name}
          </span>
        ) : kolWalletDetail ? (
          <span className="inline-flex items-center gap-1">
            {kolWalletDetail?.image_url && (
              <img
                alt={kolWalletDetail.name}
                className="size-4 rounded-full"
                src={kolWalletDetail.image_url}
              />
            )}
            <span>{kolWalletDetail.name}</span>
          </span>
        ) : (
          shortAddress
        )}
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
                  : isPool
                    ? 'Liquidity Pool'
                    : ''
        }
      >
        {isUser ? (
          <Icon
            className="text-v1-content-brand [&>svg]:size-3"
            name={bxUser}
          />
        ) : isDev ? (
          <DevIcon className="size-3 text-v1-content-brand" />
        ) : kolWalletDetail ? (
          <Icon
            className="text-v1-content-brand [&>svg]:size-3"
            name={bxTrophy}
          />
        ) : isPool ? (
          <Icon
            className="text-v1-content-brand [&>svg]:size-3"
            name={bxDroplet}
          />
        ) : null}
      </HoverTooltip>
      {notificationContent}
    </span>
  );
};
