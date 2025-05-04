import { type FC } from 'react';
import { bxsCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from './Icon';
import { useShare } from './useShare';

export const ContractAddress: FC<{
  className?: string;
  value?: string | true;
  allowCopy?: boolean;
  fallbackAsNativeCoin?: boolean;
}> = ({ className, value, allowCopy = true, fallbackAsNativeCoin = true }) => {
  const { t } = useTranslation('coin-radar');
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
          {allowCopy && (
            <button onClick={() => copy(value)} className="cursor-copy">
              <Icon name={bxsCopy} size={12} />
            </button>
          )}
          {allowCopy && copyNotif}
        </div>
      ) : value === true || (fallbackAsNativeCoin && value === '') ? (
        <p className={clsx('text-xs text-v1-content-secondary', className)}>
          {t('common.native_coin')}
        </p>
      ) : null}
    </>
  );
};
