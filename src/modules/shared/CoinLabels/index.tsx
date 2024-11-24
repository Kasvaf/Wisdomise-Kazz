import { clsx } from 'clsx';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { type Coin } from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';

const sharedLabelClassName = clsx(
  'rounded-full px-3 py-1 text-center text-xxs',
);

function CoinLabel({
  className,
  value,
}: {
  className?: string;
  value: string;
}) {
  const { t } = useTranslation('coin-radar');

  const renderData = useMemo(() => {
    const knownSuffixes = {
      hype: t('coin_labels.hype.suffix'),
      weekly_social_beloved: t('coin_labels.weekly_social_beloved.suffix'),
      monthly_social_beloved: t('coin_labels.monthly_social_beloved.suffix'),
    };
    const knownInfos = {
      hype: t('coin_labels.hype.info'),
      weekly_social_beloved: t('coin_labels.weekly_social_beloved.info'),
      monthly_social_beloved: t('coin_labels.monthly_social_beloved.info'),
    };
    const knowColors = {
      hype: clsx('bg-v1-content-positive/10 text-v1-content-positive'),
      weekly_social_beloved: clsx(
        'bg-v1-content-brand/10 text-v1-content-brand',
      ),
      monthly_social_beloved: clsx(
        'bg-v1-content-brand/10 text-v1-content-brand',
      ),
    };
    const defaultColor = clsx(
      'bg-v1-content-tertiary/10 text-v1-content-tertiary',
    );

    return {
      emoji: value in knownSuffixes ? knownSuffixes[value as never] : '🏷️',
      text: value.split('_').join(' '),
      info: value in knownInfos ? knownInfos[value as never] : undefined,
      className:
        value in knowColors ? knowColors[value as never] : defaultColor,
    };
  }, [value, t]);

  return (
    <ClickableTooltip
      title={
        <div>
          <p className="mb-2 text-sm capitalize text-v1-content-primary">
            {renderData.text}
          </p>
          <p className="text-xs text-v1-content-secondary">{renderData.info}</p>
        </div>
      }
      chevron={false}
      disabled={!renderData.info}
      className={clsx(
        sharedLabelClassName,
        renderData.className,
        'whitespace-nowrap capitalize',
        className,
      )}
    >
      {renderData.emoji} {renderData.text}
    </ClickableTooltip>
  );
}

export function CoinLabels({
  className,
  categories,
  labels,
  prefix,
  suffix,
}: {
  className?: string;
  categories?: Coin['categories'] | null;
  maxCategories?: number;
  labels?: string[] | null;
  prefix?: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <div className={clsx('flex flex-wrap items-center gap-1', className)}>
      {prefix}
      {categories && (
        <>
          {(categories.length ?? 0) > 1 ? (
            <ClickableTooltip
              title={
                <ul className="space-y-6">
                  {(categories ?? []).map(cat => (
                    <li key={cat.slug}>{cat.name}</li>
                  ))}
                </ul>
              }
              className={clsx(
                sharedLabelClassName,
                'bg-v1-content-primary/10 text-v1-content-primary',
              )}
            >
              {categories[0].name}
              <span className="rounded-lg bg-v1-content-primary/20 px-[5px] text-[9px]">
                {`+${categories.length - 1}`}
              </span>
            </ClickableTooltip>
          ) : (categories.length ?? 0) === 1 ? (
            <span
              className={clsx(
                sharedLabelClassName,
                'bg-v1-content-primary/10 text-v1-content-primary',
              )}
            >
              {categories[0].name}
            </span>
          ) : null}
        </>
      )}
      {(labels ?? []).map(label => (
        <CoinLabel key={label} value={label} />
      ))}
      {suffix}
    </div>
  );
}
