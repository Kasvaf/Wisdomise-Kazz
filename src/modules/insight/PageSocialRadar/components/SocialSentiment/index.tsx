import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type SocialRadarSentiment } from 'api';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { ReadableDate } from 'shared/ReadableDate';
import { MiniBar } from 'shared/MiniBar';
import { SocialSentimentModal } from './SocialSentimentModal';
import { SocialSentimentTitle } from './SocialSentimentTitle';

export const SocialSentiment: FC<{
  value?: SocialRadarSentiment | null;
  className?: string;
  detailsLevel?: 1 | 2 | 3;
}> = ({ value, className, detailsLevel }) => {
  const { t } = useTranslation('coin-radar');

  return (
    <>
      {detailsLevel === 3 && (
        <ClickableTooltip
          title={<SocialSentimentModal value={value} />}
          chevron={false}
        >
          <span className={clsx('space-y-[2px] whitespace-nowrap', className)}>
            <div className="flex items-center gap-1 text-sm capitalize">
              <SocialSentimentTitle value={value} />
            </div>
            <div className="flex items-center gap-1 ps-[17px] text-xxs">
              <label className="text-v1-content-secondary">
                {t('call-change.last-mention')}:
              </label>
              <ReadableDate
                popup={false}
                value={value?.last_signal_related_at}
              />
            </div>
          </span>
        </ClickableTooltip>
      )}
      {(detailsLevel === 1 || detailsLevel === 2) && (
        <div className="inline-flex items-center gap-1">
          <SocialSentimentTitle
            value={value}
            icon
            iconSize={28}
            className="shrink-0"
          />
          <MiniBar value={value?.gauge_measure ?? 0} />
          {detailsLevel === 2 && (
            <span className={clsx('whitespace-nowrap ps-1', className)}>
              <div className="flex items-center gap-1 text-sm capitalize">
                <SocialSentimentTitle value={value} icon={false} />
              </div>
              <div className="flex items-center gap-1 text-[8px]">
                <label className="text-v1-content-secondary">
                  {t('call-change.last-mention')}:
                </label>
                <ReadableDate
                  popup={false}
                  value={value?.last_signal_related_at}
                  className="capitalize text-inherit"
                />
              </div>
            </span>
          )}
        </div>
      )}
    </>
  );
};
