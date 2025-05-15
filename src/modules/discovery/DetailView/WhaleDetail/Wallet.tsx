import { bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'shared/Icon';
import { shortenAddress } from 'utils/shortenAddress';
import { Button } from 'shared/v1-components/Button';
import { useShare } from 'shared/useShare';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import useIsMobile from 'utils/useIsMobile';

export const Wallet: FC<{
  wallet: {
    address: string;
    network: string;
  };
  mode?: 'link' | 'title';
  className?: string;
}> = ({ className, wallet, mode }) => {
  const isMobile = useIsMobile();
  const [copy, notificationContent] = useShare('copy');
  const shortAddress = shortenAddress(wallet.address);
  const { getUrl, params } = useDiscoveryRouteMeta();

  const avatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${(
    wallet.network + wallet.address
  ).toLowerCase()}`;

  return (
    <>
      {mode === 'title' ? (
        <div className={clsx('flex items-center gap-3', className)}>
          <img
            src={avatar}
            width={28}
            height={28}
            className="size-7 rounded-full"
          />
          <h1 className="text-lg font-bold"> {shortAddress} </h1>
          <Button
            onClick={() => copy(wallet.address)}
            size="sm"
            className="-ms-1 w-sm"
            variant="ghost"
            surface={1}
          >
            <Icon name={bxCopy} size={24} />
          </Button>
        </div>
      ) : (
        <Link
          className={clsx(
            'inline-flex w-max items-center gap-2 overflow-hidden rounded-md p-1 pe-2 font-mono',
            'bg-transparent text-v1-content-primary transition-all hover:bg-v1-background-hover hover:text-inherit',
            className,
          )}
          to={getUrl({
            detail: 'whale',
            slug: `${wallet.network}/${wallet.address}`,
            view: isMobile || params.view === 'detail' ? 'detail' : 'both',
          })}
        >
          <img
            src={avatar}
            width={32}
            height={32}
            className="size-7 rounded-full"
          />
          <span>{shortAddress}</span>
        </Link>
      )}
      {notificationContent}
    </>
  );
};
