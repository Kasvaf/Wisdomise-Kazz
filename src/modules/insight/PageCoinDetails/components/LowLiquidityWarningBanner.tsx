import { type FC } from 'react';
import { clsx } from 'clsx';
import { bxError } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useNCoinDetails } from 'api';
import Icon from 'shared/Icon';

export const LowLiquidityWarningBanner: FC<{
  slug: string;
  className?: string;
}> = ({ slug, className }) => {
  const { t } = useTranslation('coin-radar');
  const nCoin = useNCoinDetails({ slug });

  const show = (nCoin.data?.update.liquidity.usd ?? 0) < 0; // TODO

  if (!show) return null;

  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-2 bg-v1-content-notice/10 p-2 text-xs font-normal text-v1-content-notice',
        className,
      )}
    >
      <Icon name={bxError} size={16} />
      {t('common.low_liquidity_warn')}
    </div>
  );
};
