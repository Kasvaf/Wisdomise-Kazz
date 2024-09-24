/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { type Alert, type AlertDataSource } from 'api/alert';
import Icon from 'shared/Icon';
import { useHasFlag } from 'api';
import { ReactComponent as PriceIcon } from './price.svg';
import { ReactComponent as WhaleIcon } from './whale.svg';
import { ReactComponent as IndicatorsIcon } from './indicators.svg';
import { ReactComponent as CoinRadarIcon } from './coin-radar.svg';
import { ReactComponent as SocialSentimentIcon } from './social-sentiment.svg';
import { ReactComponent as SignalerIcon } from './signaler.svg';

export const useDataSources = () => {
  const { t } = useTranslation('alerts');
  const hasFlag = useHasFlag();
  return useMemo<
    Array<{
      icon: FC<{ className?: string }>;
      title: ReactNode;
      subtitle: ReactNode;
      step: ReactNode;
      stepSubtitle?: ReactNode;
      value: AlertDataSource;
      disabled?: boolean;
      hidden?: boolean;
    }>
  >(
    () => [
      {
        title: t('forms.price.title'),
        subtitle: t('forms.price.subtitle'),
        step: t('forms.price.step'),
        icon: PriceIcon,
        value: 'market_data',
        disabled:
          !hasFlag('/insight/alerts') || !hasFlag('/insight/alerts?price'),
      },
      {
        title: t('forms.coin-radar.title'),
        subtitle: t('forms.coin-radar.subtitle'),
        step: t('forms.coin-radar.step'),
        stepSubtitle: t('forms.coin-radar.step-subtitle'),
        icon: CoinRadarIcon,
        value: 'custom:coin_radar_notification',
        disabled:
          !hasFlag('/insight/alerts') || !hasFlag('/insight/alerts?coinradar'),
      },
      {
        title: t('forms.whale.title'),
        subtitle: t('forms.whale.subtitle'),
        step: t('forms.whale.step'),
        icon: WhaleIcon,
        value: 'market_data',
        disabled: true,
      },
      {
        title: t('forms.indicators.title'),
        subtitle: t('forms.indicators.subtitle'),
        step: t('forms.indicators.step'),
        icon: IndicatorsIcon,
        value: 'market_data',
        disabled: true,
      },
      {
        title: t('forms.social-sentiment.title'),
        subtitle: t('forms.social-sentiment.subtitle'),
        step: t('forms.social-sentiment.step'),
        icon: SocialSentimentIcon,
        value: 'market_data',
        disabled: true,
      },
      {
        title: t('forms.signaler.title'),
        subtitle: t('forms.signaler.subtitle'),
        step: t('forms.signaler.step'),
        icon: SignalerIcon,
        value: 'market_data',
        disabled: true,
      },
    ],
    [t, hasFlag],
  );
};

export function DataSourceSelectForm<D extends AlertDataSource>({
  value,
  onSubmit,
  className,
}: {
  value?: Partial<Alert<D>>;
  onSubmit?: (newValue: Partial<Alert<D>>) => void;
  className?: string;
}) {
  const dataSources = useDataSources();
  const { t } = useTranslation('alerts');

  const [form, setForm] = useState<Partial<Alert<D>>>();

  useEffect(() => {
    if (form?.dataSource) {
      onSubmit?.(form);
    }
  }, [form, onSubmit, value]);

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <h2 className="mb-4 text-base">{t('forms.data-source.title')}</h2>
      {dataSources
        .sort((a, b) => (a.disabled ? 1 : 0) - (b.disabled ? 1 : 0))
        .filter(dt => !dt.hidden)
        .map(({ icon: DtIcon, ...dt }, i) => (
          <button
            key={`${dt.value}-${i}`}
            className="flex items-center justify-start gap-3 rounded-xl bg-v1-surface-l4 p-4 transition-colors hover:enabled:bg-v1-surface-l5"
            disabled={dt.disabled}
            onClick={() =>
              setForm(p => ({
                ...p,
                dataSource: dt.value,
              }))
            }
          >
            <DtIcon className="size-8 shrink-0 rounded-lg" />
            <div className="grow text-start">
              <h3 className="mb-1 text-xs text-v1-content-primary">
                {dt.title}
              </h3>
              <div className="max-w-56 text-xxs text-v1-content-secondary">
                {dt.subtitle}
              </div>
            </div>
            <span className="shrink-0">
              {dt.disabled ? (
                <span className="h-4 rounded-full bg-v1-background-brand/10 px-2 text-xxs text-v1-content-brand">
                  {t('common:soon')}
                </span>
              ) : (
                <Icon name={bxRightArrowAlt} />
              )}
            </span>
          </button>
        ))}
    </div>
  );
}
