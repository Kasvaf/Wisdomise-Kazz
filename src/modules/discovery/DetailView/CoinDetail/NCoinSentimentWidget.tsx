import { clsx } from 'clsx';
import { NCoinSecurity } from 'modules/discovery/ListView/NetworkRadar/NCoinSecurity';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useUnifiedCoinDetails } from './lib';

const NCoinSentimentCol: FC<{
  label: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}> = ({ label, children, className, contentClassName }) => (
  <div
    className={clsx(
      'flex h-12 w-auto shrink-0 flex-col justify-start gap-1 max-md:w-full',
      className,
    )}
  >
    <p className="text-v1-content-secondary text-xs">{label}</p>
    <div className={contentClassName}>{children}</div>
  </div>
);

export const NCoinSentimentWidget: FC<{
  className?: string;
  hr?: boolean;
}> = ({ className, hr }) => {
  const { t } = useTranslation('network-radar');
  const { marketData, securityData } = useUnifiedCoinDetails();

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-between gap-4 overflow-hidden max-md:flex-wrap max-md:gap-2',
          className,
        )}
      >
        <NCoinSentimentCol
          contentClassName="text-xs mt-1"
          label={t('common.marketcap')}
        >
          <ReadableNumber
            label="$"
            popup="never"
            value={marketData.marketCap}
          />
        </NCoinSentimentCol>
        <div className="h-10 w-px shrink-0 bg-white/10 max-md:hidden" />
        <NCoinSentimentCol
          className="w-1/3 justify-self-end pe-12"
          label={t('common.validation_insights')}
        >
          <NCoinSecurity
            className="text-2xs"
            imgClassName="size-4 shrink-0"
            type="row2"
            value={securityData}
          />
        </NCoinSentimentCol>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
