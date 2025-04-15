import { type ReactNode, type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { NCoinSecurity } from 'modules/insight/PageNetworkRadar/components/NCoinSecurity';
import { NCoinLiquidity } from 'modules/insight/PageNetworkRadar/components/NCoinLiquidity';
import { useNCoinDetails } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';

const NCoinSentimentCol: FC<{
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

export const NCoinSentimentWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const { t } = useTranslation('network-radar');
  const nCoin = useNCoinDetails({ slug });
  if (!nCoin.data) return null;

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-between gap-4 overflow-hidden mobile:flex-wrap mobile:overflow-auto',
          className,
        )}
      >
        <NCoinSentimentCol
          label={t('common.liquidity')}
          contentClassName="text-xs mt-1"
        >
          <NCoinLiquidity
            type="update_row"
            value={nCoin.data}
            imgClassName="size-4"
          />
        </NCoinSentimentCol>
        <NCoinSentimentCol
          label={t('common.initial_liquidity')}
          contentClassName="text-xs mt-1"
        >
          <NCoinLiquidity
            type="initial_row"
            value={nCoin.data}
            imgClassName="size-4"
          />
        </NCoinSentimentCol>
        <NCoinSentimentCol
          label={t('common.marketcap')}
          contentClassName="text-xs mt-1"
        >
          <ReadableNumber
            label="$"
            value={nCoin.data?.update.base_market_data.market_cap}
            popup="never"
          />
        </NCoinSentimentCol>
        <div className="h-16 w-px shrink-0 bg-white/10" />
        <NCoinSentimentCol
          label={t('common.validation_insights')}
          className="w-1/3 justify-self-end pe-12"
        >
          <NCoinSecurity
            value={nCoin.data}
            type="row2"
            className="text-xxs"
            imgClassName="size-4 shrink-0"
          />
        </NCoinSentimentCol>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
