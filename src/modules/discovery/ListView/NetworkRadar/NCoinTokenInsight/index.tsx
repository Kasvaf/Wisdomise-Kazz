import { clsx } from 'clsx';
import { type FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge } from 'shared/v1-components/Badge';
import { ReactComponent as DevHolding } from './dev_holding.svg';
import { ReactComponent as Top10HoldersHolding } from './top_10_holders_holding.svg';

export const NCoinTokenInsight: FC<{
  className?: string;
  value?: {
    top10Holding?: number;
    snipersHolding?: number;
    numberOfHolders?: number;
    insiderHolding?: number;
    devHolding?: number;
    boundleHolding?: number;
  };
  type: 'row' | 'card';
}> = memo(({ type, className, value }) => {
  const { t } = useTranslation('network-radar');

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
        value: value?.top10Holding,
        title: t('network-radar:token_insight.top_10_holders_holding.mini'),
        fullTitle: t('network-radar:token_insight.top_10_holders_holding.full'),
        color:
          typeof value?.top10Holding === 'number'
            ? (value?.top10Holding ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'dev_holding',
        icon: DevHolding,
        value: value?.devHolding,
        title: t('network-radar:token_insight.dev_holding.mini'),
        fullTitle: t('network-radar:token_insight.dev_holding.full'),
        color:
          typeof value?.devHolding === 'number'
            ? (value?.devHolding ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      // {
      //   key: 'snipers_holding',
      //   icon: SnipersHolding,
      //   value: value?.snipersHolding,
      //   title: t('network-radar:token_insight.snipers_holding.mini'),
      //   fullTitle: t('network-radar:token_insight.snipers_holding.full'),
      //   color:
      //     typeof value?.snipersHolding === 'number'
      //       ? (value?.snipersHolding ?? 0) < 15
      //         ? 'green'
      //         : 'red'
      //       : 'gray',
      // },
      // {
      //   key: 'insiders_holding',
      //   icon: InsidersHolding,
      //   value: value?.insiderHolding,
      //   title: t('network-radar:token_insight.insiders_holding.mini'),
      //   fullTitle: t('network-radar:token_insight.insiders_holding.full'),
      //   color:
      //     typeof value?.insiderHolding === 'number'
      //       ? (value?.insiderHolding ?? 0) < 15
      //         ? 'green'
      //         : 'red'
      //       : 'gray',
      // },
      // {
      //   key: 'bundle_holding',
      //   icon: BundleHolding,
      //   value: value?.boundleHolding,
      //   title: t('network-radar:token_insight.bundle_holding.mini'),
      //   fullTitle: t('network-radar:token_insight.bundle_holding.full'),
      //   color:
      //     typeof value?.boundleHolding === 'number'
      //       ? (value?.boundleHolding ?? 0) < 15
      //         ? 'green'
      //         : 'red'
      //       : 'gray',
      // },
    ],
    [value, t],
  );

  return (
    <>
      {type === 'row' ? (
        <div
          className={clsx(
            'flex items-center gap-1',
            !value && 'animate-pulse',
            className,
          )}
        >
          {items.map(item => (
            <Badge
              color={
                item.color === 'green'
                  ? 'positive'
                  : item.color === 'red'
                    ? 'negative'
                    : 'neutral'
              }
              key={item.key}
              title={item.fullTitle}
              variant="outline"
            >
              <item.icon />
              <ReadableNumber
                emptyText=""
                format={{ decimalLength: 1 }}
                popup="never"
                value={item.value}
              />
              %
            </Badge>
          ))}
        </div>
      ) : (
        <div
          className={clsx(
            'rounded-lg bg-v1-surface-l-next p-3 text-xs',
            className,
          )}
        >
          <p className="mb-3 font-normal">
            {t('network-radar:token_insight.title')}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {items.map(item => (
              <div
                className={clsx('flex flex-col gap-1')}
                key={item.key}
                title={item.fullTitle}
              >
                <p className="text-v1-content-secondary text-xxs">
                  {item.title}
                </p>

                <div
                  className={clsx(
                    'relative flex shrink-0 items-center justify-start gap-1',
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
                        : item.color === 'red'
                          ? 'stroke-v1-background-negative-subtle'
                          : '',
                      'size-5',
                    )}
                  />
                  <ReadableNumber
                    format={{ decimalLength: 1 }}
                    label="%"
                    popup="never"
                    value={item.value}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
});
