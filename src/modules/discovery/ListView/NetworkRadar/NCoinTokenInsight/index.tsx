import { clsx } from 'clsx';
import { type ComponentProps, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTokenInsight } from 'api/discovery';
import { ReadableNumber } from 'shared/ReadableNumber';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Lazy } from 'shared/Lazy';
import { ReactComponent as Top10HoldersHolding } from './top_10_holders_holding.svg';
import { ReactComponent as DevHolding } from './dev_holding.svg';
import { ReactComponent as SnipersHolding } from './snipers_holding.svg';
import { ReactComponent as InsidersHolding } from './insiders_holding.svg';
import { ReactComponent as BundleHolding } from './bundle_holding.svg';

export const NCoinTokenInsightRaw: FC<{
  className?: string;
  contractAddress?: string;
  type: 'row' | 'card';
}> = ({ type, className, contractAddress }) => {
  const { t } = useTranslation('network-radar');
  const value = useTokenInsight({ contractAddress });

  const items = useMemo<
    Array<{
      key: string;
      icon: FC<{ className?: string }>;
      value: number | undefined;
      title: string;
      fullTitle: string;
      color: 'green' | 'gray' | 'red';
    }>
  >(
    () => [
      {
        key: 'top_10_holders_holding',
        icon: Top10HoldersHolding,
        value: value.data?.top_10_holders_holding_percentage,
        title: t('network-radar:token_insight.top_10_holders_holding.mini'),
        fullTitle: t('network-radar:token_insight.top_10_holders_holding.full'),
        color:
          typeof value.data?.top_10_holders_holding_percentage === 'number'
            ? (value.data?.top_10_holders_holding_percentage ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'dev_holding',
        icon: DevHolding,
        value: value.data?.dev_holding_percentage,
        title: t('network-radar:token_insight.dev_holding.mini'),
        fullTitle: t('network-radar:token_insight.dev_holding.full'),
        color:
          typeof value.data?.dev_holding_percentage === 'number'
            ? (value.data?.dev_holding_percentage ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'snipers_holding',
        icon: SnipersHolding,
        value: value.data?.snipers_holding_percentage,
        title: t('network-radar:token_insight.snipers_holding.mini'),
        fullTitle: t('network-radar:token_insight.snipers_holding.full'),
        color:
          typeof value.data?.snipers_holding_percentage === 'number'
            ? (value.data?.snipers_holding_percentage ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'insiders_holding',
        icon: InsidersHolding,
        value: value.data?.insiders_holding_percentage,
        title: t('network-radar:token_insight.insiders_holding.mini'),
        fullTitle: t('network-radar:token_insight.insiders_holding.full'),
        color:
          typeof value.data?.insiders_holding_percentage === 'number'
            ? (value.data?.insiders_holding_percentage ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'bundle_holding',
        icon: BundleHolding,
        value: value.data?.bundlers_holding_percentage,
        title: t('network-radar:token_insight.bundle_holding.mini'),
        fullTitle: t('network-radar:token_insight.bundle_holding.full'),
        color:
          typeof value.data?.bundlers_holding_percentage === 'number'
            ? (value.data?.bundlers_holding_percentage ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
    ],
    [value, t],
  );

  return (
    <>
      {type === 'row' ? (
        <div
          className={clsx(
            'flex items-center gap-1',
            !value.data && 'animate-pulse',
            className,
          )}
        >
          {items.map(item => (
            <HoverTooltip key={item.key} title={item.fullTitle}>
              <div
                className={clsx(
                  'relative flex shrink-0 items-center justify-start gap-px text-xxs',
                  'rounded-full border border-v1-border-primary/30 px-1 py-[2px]',
                  item.color === 'green'
                    ? 'text-v1-background-positive'
                    : item.color === 'red'
                    ? 'text-v1-background-negative'
                    : 'opacity-80',
                )}
              >
                <item.icon
                  className={clsx(
                    item.color === 'green'
                      ? 'stroke-v1-background-positive-subtle'
                      : 'stroke-v1-background-negative-subtle',
                    'size-4',
                  )}
                />{' '}
                <ReadableNumber
                  value={item.value}
                  label="%"
                  format={{ decimalLength: 1 }}
                  popup="never"
                  emptyText=""
                />
              </div>
            </HoverTooltip>
          ))}
        </div>
      ) : (
        <div
          className={clsx(
            'rounded-lg p-3 text-xs bg-v1-surface-l-next',
            className,
          )}
        >
          <p className="mb-3 font-normal">
            {t('network-radar:token_insight.title')}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {items.map(item => (
              <HoverTooltip key={item.key} title={item.fullTitle}>
                <div className={clsx('flex flex-col gap-1')}>
                  <p className="text-xxs text-v1-content-secondary">
                    {item.title}
                  </p>

                  <div
                    className={clsx(
                      'relative flex shrink-0 items-center justify-start gap-1 text-xs',
                      item.color === 'green'
                        ? 'text-v1-background-positive'
                        : item.color === 'red'
                        ? 'text-v1-background-negative'
                        : 'opacity-80',
                    )}
                  >
                    <item.icon
                      className={clsx(
                        item.color === 'green'
                          ? 'stroke-v1-background-positive-subtle'
                          : 'stroke-v1-background-negative-subtle',
                        'size-5',
                      )}
                    />
                    <ReadableNumber
                      value={item.value}
                      label="%"
                      format={{ decimalLength: 1 }}
                      popup="never"
                    />
                  </div>
                </div>
              </HoverTooltip>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export const NCoinTokenInsight: FC<
  ComponentProps<typeof NCoinTokenInsightRaw> & { rootClassName?: string }
> = ({ rootClassName, ...props }) => {
  const { t } = useTranslation('common');
  return (
    <Lazy
      className={rootClassName}
      fallback={<p className="animate-pulse text-xxs">{t('loading')}</p>}
    >
      <NCoinTokenInsightRaw {...props} />
    </Lazy>
  );
};
