import { type FC } from 'react';
import { bxsCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from './Icon';
import { useShare } from './useShare';

export const ContractAddress: FC<{
  className?: string;
  value?: string | true;
}> = ({ className, value }) => {
  const [copy, copyNotif] = useShare('copy');

  return (
    <>
      {typeof value === 'string' && value.length > 0 ? (
        <div
          className={clsx(
            'flex items-center gap-1 text-xs text-v1-content-secondary',
            className,
          )}
        >
          {shortenAddress(value)}
          <Icon
            name={bxsCopy}
            size={12}
            className="cursor-pointer"
            onClick={() => copy(value)}
          />
          {copyNotif}
        </div>
      ) : value === true || value === '' ? (
        <p className={clsx('text-xs text-v1-content-secondary', className)}>
          {'Native Coin'}
        </p>
      ) : null}
    </>
  );
};
