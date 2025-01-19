import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import {
  useHasFlag,
  useWhaleRadarSentiment,
  type WhaleRadarSentiment,
} from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DebugPin } from 'shared/DebugPin';

const useWhaleSentimentFields = (): Array<{
  label: string;
  key: keyof WhaleRadarSentiment;
  bgClassName: string;
  textClassName: string;
}> => {
  const { t } = useTranslation('coin-radar');
  return [
    {
      label: t('coin-details.tabs.whale_sentiment.buy'),
      key: 'buy_percent',
      bgClassName: 'bg-v1-content-positive',
      textClassName: 'text-v1-content-positive',
    },
    {
      label: t('coin-details.tabs.whale_sentiment.hold'),
      key: 'hold_percent',
      bgClassName: 'bg-v1-content-primary',
      textClassName: 'text-v1-content-primary',
    },
    {
      label: t('coin-details.tabs.whale_sentiment.sell'),
      key: 'sell_percent',
      bgClassName: 'bg-v1-content-negative',
      textClassName: 'text-v1-content-negative',
    },
  ];
};

export function WhaleRadarSentimentWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const sentiment = useWhaleRadarSentiment({ slug });
  const fields = useWhaleSentimentFields();
  const hasFlag = useHasFlag();
  const isAllZero =
    !sentiment.data || Object.values(sentiment.data).every(x => (x ?? 0) === 0);
  if (!hasFlag('/coin-radar/social-radar?whale')) return null;
  return (
    <OverviewWidget
      className={clsx('!p-4', className)}
      loading={sentiment.isLoading}
      contentClassName={clsx(
        'flex h-20 flex-col justify-between gap-3 overflow-hidden',
        isAllZero && 'contrast-75 grayscale',
      )}
      overlay={
        <DebugPin title="/coin-radar/social-radar?whale" color="orange" />
      }
    >
      <p className="text-xxs text-v1-content-primary">
        {t('coin-details.tabs.whale_sentiment.title')}
      </p>
      <div className="space-y-3">
        <div className="relative flex h-1 shrink flex-row gap-px overflow-hidden rounded-lg">
          {fields.map(field => (
            <div
              key={field.key}
              className={clsx(
                'min-w-2 grow',
                isAllZero && 'opacity-50',
                field.bgClassName,
              )}
              style={{
                flexBasis: isAllZero
                  ? '33%'
                  : `${sentiment.data?.[field.key] ?? 0}%`,
              }}
            />
          ))}
        </div>
        <div className="flex flex-row gap-1">
          {fields.map(field => (
            <div
              key={field.key}
              className={clsx(
                'flex shrink basis-full items-center justify-center gap-1 rounded-md bg-v1-surface-l3 px-2 py-1 text-xs',
                !isAllZero && field.textClassName,
              )}
            >
              {field.label}
              <ReadableNumber
                label="%"
                value={isAllZero ? null : sentiment.data?.[field.key] ?? 0}
                popup="never"
                format={{
                  decimalLength: 1,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </OverviewWidget>
  );
}
