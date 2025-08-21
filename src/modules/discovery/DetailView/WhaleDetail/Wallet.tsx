import { bxsCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';

export const Wallet: FC<{
  wallet: {
    address: string;
    network: string;
  };
  whale?: boolean;
  noLink?: boolean;
  className?: string;
}> = ({ className, wallet, noLink, whale }) => {
  const [copy, notificationContent] = useShare('copy');
  const shortAddress = shortenAddress(wallet.address);
  const { getUrl } = useDiscoveryRouteMeta();

  const avatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${(
    wallet.network + wallet.address
  ).toLowerCase()}`;

  const RootComponent = noLink ? 'span' : Link;

  return (
    <RootComponent
      className={clsx(
        'inline-flex w-max items-center gap-2 overflow-hidden rounded-md p-1 pe-2 font-mono',
        !noLink &&
          'bg-transparent text-v1-content-primary transition-all hover:bg-v1-background-hover hover:text-inherit',
        className,
      )}
      to={
        whale
          ? getUrl({
              detail: 'whale',
              slug: `${wallet.network}/${wallet.address}`,
            })
          : '#'
      }
    >
      <img
        className="size-7 rounded-full"
        height={32}
        src={avatar}
        width={32}
      />
      <span>{shortAddress}</span>
      <Icon
        className="cursor-copy opacity-75 [&_svg]:size-3"
        name={bxsCopy}
        onClick={e => {
          e.preventDefault();
          void copy(wallet.address);
        }}
        size={6}
      />

      {notificationContent}
    </RootComponent>
  );
};
