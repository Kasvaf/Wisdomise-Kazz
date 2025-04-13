import { type ReactNode, type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { usePoolDetails } from 'api';
import { PoolSecurity } from 'modules/insight/PageNetworkRadar/components/PoolSecurity';
import { PoolLiquidity } from 'modules/insight/PageNetworkRadar/components/PoolLiquidity';
import { ReadableNumber } from 'shared/ReadableNumber';

// <p>{t('common.liquidity')}</p>
// <div>
//   <PoolLiquidity
//     type="update_row"
//     value={value}
//     imgClassName="size-4"
//   />
// </div>
// <p>{t('common.initial_liquidity')}</p>
// <div>
//   <PoolLiquidity
//     type="initial_row"
//     value={value}
//     imgClassName="size-4"
//   />
// </div>
// <p>{t('common.marketcap')}</p>
// <div>
//   <ReadableNumber
//     label="$"
//     value={value.update.base_market_data.market_cap}
//     popup="never"
//   />
// </div>

const PoolSentimentCol: FC<{
  label: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}> = ({ label, children, className, contentClassName }) => (
  <div
    className={clsx(
      'flex h-12 w-auto shrink-0 flex-col justify-start gap-1',
      className,
    )}
  >
    <p className="text-xs text-v1-content-secondary">{label}</p>
    <div className={contentClassName}>{children}</div>
  </div>
);

export const PoolSentimentWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const { t } = useTranslation('network-radar');
  const pool = usePoolDetails({ slug });
  if (!pool.data && !pool.isLoading) return null;

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-between gap-4 overflow-hidden',
          className,
        )}
      >
        <PoolSentimentCol
          label={t('common.liquidity')}
          contentClassName="text-xs mt-1"
        >
          <PoolLiquidity
            type="update_row"
            value={pool.data}
            imgClassName="size-4"
          />
        </PoolSentimentCol>
        <PoolSentimentCol
          label={t('common.initial_liquidity')}
          contentClassName="text-xs mt-1"
        >
          <PoolLiquidity
            type="initial_row"
            value={pool.data}
            imgClassName="size-4"
          />
        </PoolSentimentCol>
        <PoolSentimentCol
          label={t('common.marketcap')}
          contentClassName="text-xs mt-1"
        >
          <ReadableNumber
            label="$"
            value={pool.data?.update.base_market_data.market_cap}
            popup="never"
          />
        </PoolSentimentCol>
        <div className="h-16 w-px shrink-0 bg-white/10" />
        <PoolSentimentCol
          label={t('common.validation_insights')}
          className="w-1/3 justify-self-end pe-12"
        >
          <PoolSecurity
            value={pool.data}
            type="row2"
            className="text-xxs"
            imgClassName="size-4 shrink-0"
          />
        </PoolSentimentCol>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
